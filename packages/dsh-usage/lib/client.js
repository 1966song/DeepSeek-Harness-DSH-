window.__ModuleLoader__.load({ id: '@local/dsh-usage', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/locales.ts
var zh = {
  "usage.actionLabel": "\u7528\u91CF",
  "usage.actionAria": "\u6253\u5F00\u7528\u91CF\u7EDF\u8BA1",
  "usage.panelTitle": "\u7528\u91CF\u7EDF\u8BA1",
  "usage.refresh": "\u5237\u65B0",
  "usage.close": "\u5173\u95ED",
  "usage.loading": "\u7EDF\u8BA1\u4E2D\u2026",
  "usage.error": "\u52A0\u8F7D\u5931\u8D25\uFF1A{message}",
  "usage.balance": "\u4F59\u989D",
  "usage.balanceUnavailable": "\u672A\u914D\u7F6E API Key",
  "usage.balanceError": "\u4F59\u989D\u67E5\u8BE2\u5931\u8D25",
  "usage.totalTokens": "\u603B\u6D88\u8017",
  "usage.estimatedCost": "\u4F30\u7B97\u8D39\u7528",
  "usage.cacheHitRate": "\u7F13\u5B58\u547D\u4E2D\u7387",
  "usage.sessions": "\u4F1A\u8BDD\u6570",
  "usage.lastDays": "\u8FD1 30 \u5929\u6D88\u8017\uFF08\u6BCF\u65E5\u603B token\uFF09",
  "usage.sessionTable": "\u4F1A\u8BDD\u660E\u7EC6",
  "usage.session.input": "\u8F93\u5165",
  "usage.session.cache": "\u7F13\u5B58\u8BFB",
  "usage.session.output": "\u8F93\u51FA",
  "usage.session.updated": "\u66F4\u65B0",
  "usage.session.cost": "\u8D39\u7528",
  "usage.empty": "\u6682\u65E0\u7528\u91CF\u8BB0\u5F55",
  "usage.note.pricing": "\u8D39\u7528\u6309\u5B98\u65B9\u4EF7\u76EE\u8868\u4F30\u7B97\uFF08\u8F93\u5165 \xA5{input}/M\uFF0C\u7F13\u5B58\u547D\u4E2D \xA5{cacheRead}/M\uFF0C\u7F13\u5B58\u5199\u5165 \xA5{cacheWrite}/M\uFF0C\u8F93\u51FA \xA5{output}/M\uFF09\uFF0C\u4EC5\u4F5C\u53C2\u8003",
  "usage.note.balance": "\u4F59\u989D\u7531\u672C\u673A dsh-usage \u8DEF\u7531\u901A\u8FC7 DeepSeek \u5B98\u65B9\u4F59\u989D\u63A5\u53E3\u67E5\u8BE2\uFF0CAPI Key \u4E0D\u79BB\u5F00\u672C\u673A",
  "usage.note.source": "\u6570\u636E\u6765\u81EA\u672C\u673A\u4F1A\u8BDD\u65E5\u5FD7\uFF08\u5DF2\u6298\u53E0\u7684\u65E7\u8BB0\u5F55\u4E0D\u53C2\u4E0E\u7EDF\u8BA1\uFF09"
};
var en = {
  "usage.actionLabel": "Usage",
  "usage.actionAria": "Open usage statistics",
  "usage.panelTitle": "Usage statistics",
  "usage.refresh": "Refresh",
  "usage.close": "Close",
  "usage.loading": "Loading\u2026",
  "usage.error": "Failed to load: {message}",
  "usage.balance": "Balance",
  "usage.balanceUnavailable": "No API key configured",
  "usage.balanceError": "Balance lookup failed",
  "usage.totalTokens": "Total tokens",
  "usage.estimatedCost": "Estimated cost",
  "usage.cacheHitRate": "Cache hit rate",
  "usage.sessions": "Sessions",
  "usage.lastDays": "Last 30 days (tokens per day)",
  "usage.sessionTable": "Session details",
  "usage.session.input": "Input",
  "usage.session.cache": "Cache read",
  "usage.session.output": "Output",
  "usage.session.updated": "Updated",
  "usage.session.cost": "Cost",
  "usage.empty": "No usage records yet",
  "usage.note.pricing": "Cost is estimated with the official price list (input \xA5{input}/M, cache hit \xA5{cacheRead}/M, cache write \xA5{cacheWrite}/M, output \xA5{output}/M); reference only",
  "usage.note.balance": "Balance is queried by the local dsh-usage route via the official DeepSeek balance API; the API key never leaves this machine",
  "usage.note.source": "Data comes from local session logs (compacted history is not included)"
};
var NS = "usage";

// src/client/UsagePanel.tsx
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime = require("react/jsx-runtime");
var styles = {
  action: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--dsw-alias-label-secondary)",
    background: "transparent",
    border: "0",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "4px 8px",
    cursor: "pointer",
    flex: "0 0 auto"
  },
  actionActive: {
    color: "var(--dsw-alias-label-primary)",
    background: "var(--dsw-alias-interactive-bg-active)"
  },
  actionIcon: {
    fontSize: "14px",
    lineHeight: "16px"
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.35)",
    zIndex: 9990
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(440px, 92vw)",
    zIndex: 9991,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-layer-1)",
    borderLeft: "1px solid var(--dsw-alias-border-l2)",
    boxShadow: "-12px 0 32px rgba(0, 0, 0, 0.25)",
    // Clear the desktop shell's frosted title bar so the header controls
    // stay reachable (no-op in a plain browser).
    paddingTop: 36
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 16px",
    borderBottom: "1px solid var(--dsw-alias-border-l1)"
  },
  headerTitle: {
    flex: 1,
    color: "var(--dsw-alias-label-primary)",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px"
  },
  button: {
    color: "var(--dsw-alias-label-secondary)",
    background: "transparent",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "3px 10px",
    cursor: "pointer"
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px"
  },
  card: {
    background: "var(--dsw-alias-bg-layer-2)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  cardLabel: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px"
  },
  cardValue: {
    color: "var(--dsw-alias-label-primary)",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "22px"
  },
  cardHint: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px"
  },
  sectionTitle: {
    color: "var(--dsw-alias-label-primary)",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "18px"
  },
  chart: {
    display: "flex",
    alignItems: "flex-end",
    gap: "3px",
    height: "88px",
    padding: "8px",
    background: "var(--dsw-alias-bg-layer-2)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "8px"
  },
  bar: {
    flex: 1,
    minWidth: "2px",
    borderRadius: "2px 2px 0 0",
    background: "var(--dsw-alias-brand-primary)",
    opacity: 0.85
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
    lineHeight: "18px"
  },
  th: {
    color: "var(--dsw-alias-label-tertiary)",
    fontWeight: 400,
    textAlign: "left",
    padding: "4px 6px",
    borderBottom: "1px solid var(--dsw-alias-border-l1)",
    whiteSpace: "nowrap"
  },
  td: {
    color: "var(--dsw-alias-label-secondary)",
    padding: "4px 6px",
    borderBottom: "1px solid var(--dsw-alias-border-l1)",
    whiteSpace: "nowrap"
  },
  tdTitle: {
    maxWidth: "140px",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  note: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px"
  },
  empty: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "12px",
    lineHeight: "18px",
    padding: "8px 0"
  },
  status: {
    color: "var(--dsw-alias-state-warn-primary)",
    fontSize: "12px",
    lineHeight: "18px"
  }
};
function formatTokens(value) {
  if (value >= 1e6) return `${(value / 1e6).toFixed(value >= 1e7 ? 0 : 1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(value >= 1e5 ? 0 : 1)}K`;
  return String(Math.round(value));
}
function formatMoney(value) {
  return `\xA5${value.toFixed(2)}`;
}
function formatUpdated(time) {
  const date = new Date(time);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${mm}-${dd} ${hh}:${mi}`;
}
async function fetchOverview() {
  const response = await fetch("/api/dsh-usage/overview", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
function Card({ label, value, hint }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.card, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.cardLabel, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.cardValue, children: value }),
    hint !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.cardHint, children: hint }) : null
  ] });
}
function UsagePanel({ wide, t }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const [overview, setOverview] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const timerRef = (0, import_react.useRef)(null);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOverview(await fetchOverview());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  };
  const openPanel = () => {
    setOpen(true);
    void load();
  };
  const closePanel = () => {
    setOpen(false);
  };
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    timerRef.current = window.setInterval(() => {
      void load();
    }, 6e4);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [open]);
  const totalTokens = overview === null ? 0 : overview.totals.uncachedInput + overview.totals.cacheRead + overview.totals.cacheWrite + overview.totals.output;
  const cacheRate = overview === null || totalTokens - overview.totals.output === 0 ? null : overview.totals.cacheRead / (overview.totals.uncachedInput + overview.totals.cacheRead + overview.totals.cacheWrite) * 100;
  const maxDay = overview === null || overview.perDay.length === 0 ? 1 : Math.max(1, ...overview.perDay.map((day) => day.uncachedInput + day.cacheRead + day.cacheWrite + day.output));
  const action = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type: "button",
      style: { ...styles.action, ...open ? styles.actionActive : {} },
      "aria-label": t("usage.actionAria"),
      "aria-pressed": open,
      onClick: openPanel,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.actionIcon, "aria-hidden": true, children: "\u26A1" }),
        wide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("usage.actionLabel") }) : null
      ]
    }
  );
  if (!open) return action;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    action,
    (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.backdrop, onClick: closePanel }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { style: styles.drawer, role: "dialog", "aria-label": t("usage.panelTitle"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.header, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.headerTitle, children: t("usage.panelTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: () => {
              void load();
            }, children: t("usage.refresh") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: closePanel, children: t("usage.close") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.body, children: [
            error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.status, children: t("usage.error", { message: error }) }) : null,
            loading && overview === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.empty, children: t("usage.loading") }) : null,
            overview === null && !loading && error === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.empty, children: t("usage.empty") }) : null,
            overview !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.cards, children: [
                overview.balance === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.balance"), value: t("usage.balanceUnavailable") }) : overview.balance.error !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.balance"), value: t("usage.balanceError"), hint: overview.balance.error }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.balance"), value: `${overview.balance.currency} ${overview.balance.total.toFixed(2)}`, hint: overview.balance.available ? void 0 : t("usage.balanceError") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.totalTokens"), value: formatTokens(totalTokens), hint: `${overview.totals.sessions} ${t("usage.sessions")}` }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.estimatedCost"), value: formatMoney(overview.totals.cost), hint: overview.pricing.currency }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { label: t("usage.cacheHitRate"), value: cacheRate === null ? "\u2014" : `${cacheRate.toFixed(1)}%` })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.sectionTitle, children: t("usage.lastDays") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.chart, role: "img", "aria-label": t("usage.lastDays"), children: overview.perDay.map((day) => {
                  const value = day.uncachedInput + day.cacheRead + day.cacheWrite + day.output;
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "div",
                    {
                      style: { ...styles.bar, height: `${Math.max(2, Math.round(value / maxDay * 100))}%` },
                      title: `${day.day}: ${formatTokens(value)}`
                    },
                    day.day
                  );
                }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.sectionTitle, children: t("usage.sessionTable") }),
                overview.perSession.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.empty, children: t("usage.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: styles.table, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.sessionTable") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.session.updated") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.session.input") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.session.cache") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.session.output") }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: styles.th, children: t("usage.session.cost") })
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: overview.perSession.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { ...styles.td, ...styles.tdTitle }, title: session.id, children: session.title }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: styles.td, children: formatUpdated(session.updatedAt) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: styles.td, children: formatTokens(session.uncachedInput) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: styles.td, children: formatTokens(session.cacheRead) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: styles.td, children: formatTokens(session.output) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: styles.td, children: formatMoney(session.cost) })
                  ] }, session.id)) })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.note, children: t("usage.note.pricing", {
                input: overview.pricing.inputPerM,
                cacheRead: overview.pricing.cacheReadPerM,
                cacheWrite: overview.pricing.cacheWritePerM,
                output: overview.pricing.outputPerM
              }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.note, children: t("usage.note.balance") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.note, children: t("usage.note.source") })
            ] }) : null
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-usage: dictionaries");
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "usage",
    order: 10,
    locale: NS
  }, UsagePanel));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
