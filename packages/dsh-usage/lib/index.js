// src/index.ts
import { credentialRef } from "@deepseek-ai/dsh-credentials";

// src/pricing.ts
var PRICING = {
  currency: "CNY",
  inputPerM: 2,
  cacheReadPerM: 0.5,
  cacheWritePerM: 2,
  outputPerM: 8
};
function costOf(buckets, pricing = PRICING) {
  const perM = (tokens, price) => tokens / 1e6 * price;
  return perM(buckets.uncachedInput, pricing.inputPerM) + perM(buckets.cacheRead, pricing.cacheReadPerM) + perM(buckets.cacheWrite, pricing.cacheWritePerM) + perM(buckets.output, pricing.outputPerM);
}

// src/shared.ts
function emptyBuckets() {
  return { uncachedInput: 0, cacheRead: 0, cacheWrite: 0, output: 0, cost: 0 };
}

// src/fold.ts
function localDayKey(time) {
  const date = new Date(time);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function bucketsOf(usage) {
  return {
    uncachedInput: usage.inputTokens,
    cacheRead: usage.cacheReadTokens ?? 0,
    cacheWrite: usage.cacheWriteTokens ?? 0,
    output: usage.outputTokens
  };
}
function foldSession(events) {
  const samples = /* @__PURE__ */ new Map();
  let turns = 0;
  let updatedAt = 0;
  for (const event of events) {
    if (event.time > updatedAt) updatedAt = event.time;
    if (event.type === "turn/start") {
      turns += 1;
    } else if (event.type === "assistant/chunk" && event.data.chunk.type === "usage") {
      samples.set(`${event.data.turn}:${event.data.step}`, { usage: event.data.chunk.usage, time: event.time });
    } else if (event.type === "assistant/message" && event.data.usage !== void 0) {
      samples.set(`${event.data.turn}:${event.data.step}`, { usage: event.data.usage, time: event.time });
    }
  }
  const totals = emptyBuckets();
  const days = /* @__PURE__ */ new Map();
  for (const { usage, time } of samples.values()) {
    const buckets = bucketsOf(usage);
    totals.uncachedInput += buckets.uncachedInput;
    totals.cacheRead += buckets.cacheRead;
    totals.cacheWrite += buckets.cacheWrite;
    totals.output += buckets.output;
    const key = localDayKey(time);
    let day = days.get(key);
    if (day === void 0) {
      day = emptyBuckets();
      days.set(key, day);
    }
    day.uncachedInput += buckets.uncachedInput;
    day.cacheRead += buckets.cacheRead;
    day.cacheWrite += buckets.cacheWrite;
    day.output += buckets.output;
  }
  totals.cost = costOf(totals);
  for (const day of days.values()) day.cost = costOf(day);
  return { totals, days, updatedAt, turns };
}

// src/index.ts
var name = "dsh-usage";
var inject = ["webServer", "sessionQuery"];
var BALANCE_URL = "https://api.deepseek.com/user/balance";
var DEFAULT_KEY_ENV = "DEEPSEEK_API_KEY";
var MAX_SESSIONS = 200;
var DAYS = 30;
var FOLD_CONCURRENCY = 8;
var OVERVIEW_TTL_MS = 15e3;
var BALANCE_TTL_MS = 6e4;
var cachedOverview = null;
var cachedBalance = null;
function writeJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
}
async function resolveApiKey(ctx) {
  const credentials = ctx.get("credentials");
  if (credentials !== void 0) {
    try {
      const hit = await credentials.resolve(credentialRef(DEFAULT_KEY_ENV));
      if (hit !== void 0) return hit.value;
    } catch {
    }
  }
  return process.env[DEFAULT_KEY_ENV] ?? null;
}
async function fetchBalance(ctx) {
  const key = await resolveApiKey(ctx);
  if (key === null) return null;
  const failed = (message) => ({
    available: false,
    currency: "CNY",
    total: 0,
    granted: 0,
    toppedUp: 0,
    error: message
  });
  try {
    const response = await fetch(BALANCE_URL, {
      headers: { authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8e3)
    });
    if (!response.ok) return failed(`balance api ${response.status}`);
    const payload = await response.json();
    const info = payload.balance_infos?.[0];
    if (info === void 0) return failed("empty balance response");
    return {
      available: payload.is_available ?? true,
      currency: info.currency ?? "CNY",
      total: Number(info.total_balance ?? 0),
      granted: Number(info.granted_balance ?? 0),
      toppedUp: Number(info.topped_up_balance ?? 0)
    };
  } catch (error) {
    return failed(`balance lookup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function foldRecords(ctx, records) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(FOLD_CONCURRENCY, records.length) }, async () => {
    while (cursor < records.length) {
      const index = cursor;
      cursor += 1;
      const record = records[index];
      try {
        const [snapshot, title] = await Promise.all([
          ctx.sessionQuery.readSession(record.header.id),
          ctx.sessionQuery.readTitle(record.header.id)
        ]);
        results.push({ record, fold: foldSession(snapshot.events), title: title?.title });
      } catch (error) {
        console.warn(`[dsh-usage] fold ${record.header.id}:`, error);
        results.push({ record, fold: { totals: emptyBuckets(), days: /* @__PURE__ */ new Map(), updatedAt: record.header.createdAt, turns: 0 } });
      }
    }
  });
  await Promise.all(workers);
  return results;
}
async function computeOverview(ctx) {
  const records = await ctx.sessionQuery.listSessions();
  const folded = await foldRecords(ctx, records.slice(0, MAX_SESSIONS));
  const totals = emptyBuckets();
  const days = /* @__PURE__ */ new Map();
  const perSession = [];
  for (const { record, fold, title } of folded) {
    const used = fold.totals.uncachedInput + fold.totals.cacheRead + fold.totals.cacheWrite + fold.totals.output;
    if (used === 0) continue;
    totals.uncachedInput += fold.totals.uncachedInput;
    totals.cacheRead += fold.totals.cacheRead;
    totals.cacheWrite += fold.totals.cacheWrite;
    totals.output += fold.totals.output;
    for (const [key, day] of fold.days) {
      const target = days.get(key);
      if (target === void 0) days.set(key, { ...day });
      else {
        target.uncachedInput += day.uncachedInput;
        target.cacheRead += day.cacheRead;
        target.cacheWrite += day.cacheWrite;
        target.output += day.output;
        target.cost += day.cost;
      }
    }
    perSession.push({
      id: record.header.id,
      title: title ?? record.header.id,
      updatedAt: fold.updatedAt,
      turns: fold.turns,
      ...fold.totals
    });
  }
  totals.cost = totals.uncachedInput + totals.cacheRead + totals.cacheWrite + totals.output === 0 ? 0 : perSession.reduce((sum, row) => sum + row.cost, 0);
  const now = /* @__PURE__ */ new Date();
  const perDay = [];
  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = localDayKey(date.getTime());
    perDay.push({ day: key, ...days.get(key) ?? emptyBuckets() });
  }
  return {
    generatedAt: Date.now(),
    pricing: PRICING,
    totals: { ...totals, sessions: perSession.length },
    perDay,
    perSession,
    balance: await cachedBalancePayload(ctx)
  };
}
async function cachedBalancePayload(ctx) {
  const now = Date.now();
  if (cachedBalance !== null && now - cachedBalance.at < BALANCE_TTL_MS) {
    return cachedBalance.balance;
  }
  const balance = await fetchBalance(ctx);
  cachedBalance = { at: now, balance };
  return balance;
}
async function computeOverviewCached(ctx) {
  const now = Date.now();
  if (cachedOverview !== null && now - cachedOverview.at < OVERVIEW_TTL_MS) {
    return cachedOverview.payload;
  }
  const payload = await computeOverview(ctx);
  cachedOverview = { at: now, payload };
  return payload;
}
function apply(ctx) {
  ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-usage/overview",
    handler: async (_req, res) => {
      try {
        writeJson(res, 200, await computeOverviewCached(ctx));
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  });
  setTimeout(() => {
    computeOverviewCached(ctx).catch((error) => {
      console.warn("[dsh-usage] warm-up failed:", error);
    });
  }, 0);
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
