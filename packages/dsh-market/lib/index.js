// src/market.ts
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
var COPY_FILES = ["lib", "package.json", "cordis.patch.yml", "dsh.plugin.json", "README.md", "LICENSE"];
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}
function profileDir() {
  return join(dshHome(), "profiles", "web");
}
function localPackagesDir() {
  return join(dshHome(), "profiles", "node_modules", "@local");
}
function profilePatchPath() {
  return join(profileDir(), "cordis.patch.yml");
}
function resolveRepo() {
  const candidates = [
    process.env.DSH_MARKET_REPO,
    "F:\\DSH\u63D2\u4EF6",
    join(homedir(), "DSH\u63D2\u4EF6"),
    join(homedir(), "dsh-plugin-suite")
  ].filter((value) => typeof value === "string" && value.length > 0);
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "packages"))) return resolve(candidate);
  }
  return null;
}
function readManifest(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  } catch {
    return null;
  }
}
function unscoped(id) {
  return id.startsWith("@local/") ? id.slice(7) : id;
}
function isInstalled(packageName) {
  const dir = join(localPackagesDir(), unscoped(packageName));
  if (!existsSync(join(dir, "package.json"))) return false;
  try {
    return readFileSync(profilePatchPath(), "utf8").includes(`name: '${packageName}'`);
  } catch {
    return false;
  }
}
function catalogDir(packageDir, source) {
  const manifest = readManifest(packageDir);
  if (manifest === null || typeof manifest.name !== "string") return null;
  const built = existsSync(join(packageDir, "lib", "index.js"));
  return {
    id: manifest.name,
    name: unscoped(manifest.name),
    description: typeof manifest.description === "string" ? manifest.description : "",
    version: typeof manifest.version === "string" ? manifest.version : "",
    source,
    built,
    installed: isInstalled(manifest.name)
  };
}
function scanRepo(repo) {
  const packagesDir = join(repo, "packages");
  try {
    return readdirSync(packagesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => catalogDir(join(packagesDir, entry.name), "repo")).filter((plugin) => plugin !== null);
  } catch {
    return [];
  }
}
function catalog() {
  const repo = resolveRepo();
  const plugins = repo === null ? [] : scanRepo(repo);
  plugins.sort((a, b) => a.name.localeCompare(b.name));
  return { repo, plugins };
}
function splitHeader(content) {
  const lines = content.split(/\r?\n/);
  const header = [];
  let index = 0;
  while (index < lines.length && (lines[index].trim() === "" || lines[index].trimStart().startsWith("#"))) {
    header.push(lines[index]);
    index += 1;
  }
  return { header: header.join("\n"), body: lines.slice(index).join("\n") };
}
function upsertInsert(packageName) {
  const patchPath = profilePatchPath();
  const content = readFileSync(patchPath, "utf8");
  const lines = content.split(/\r?\n/);
  const marker = `name: '${packageName}'`;
  const hit = lines.findIndex((line) => line.includes(marker));
  const insert = `- insert:
    - id: '${packageName}'
      name: '${packageName}'
`;
  if (hit >= 0) {
    let start = hit;
    while (start > 0 && !lines[start].trimStart().startsWith("- insert:")) start -= 1;
    lines.splice(start, hit - start + 1);
    const kept = lines.join("\n");
    const { header: header2, body: body2 } = splitHeader(kept);
    const trimmed2 = body2.trim();
    writeFileSync(patchPath, `${header2}${header2.endsWith("\n") || header2 === "" ? "" : "\n"}${trimmed2 === "" || trimmed2 === "[]" ? "" : `${trimmed2}
`}${insert}`, "utf8");
    return;
  }
  const { header, body } = splitHeader(content);
  const trimmed = body.trim();
  if (trimmed === "" || trimmed === "[]") {
    writeFileSync(patchPath, `${header}${header.endsWith("\n") || header === "" ? "" : "\n"}${insert}`, "utf8");
  } else {
    writeFileSync(patchPath, `${header}${header.endsWith("\n") || header === "" ? "" : "\n"}${trimmed}
${insert}`, "utf8");
  }
}
function removeInsert(packageName) {
  const patchPath = profilePatchPath();
  const content = readFileSync(patchPath, "utf8");
  const lines = content.split(/\r?\n/);
  const marker = `name: '${packageName}'`;
  const hit = lines.findIndex((line) => line.includes(marker));
  if (hit < 0) return;
  let start = hit;
  while (start > 0 && !lines[start].trimStart().startsWith("- insert:")) start -= 1;
  lines.splice(start, hit - start + 1);
  writeFileSync(patchPath, lines.join("\n"), "utf8");
}
function installFromDir(packageDir, packageName) {
  if (!existsSync(join(packageDir, "lib", "index.js"))) {
    const built = ensureBuilt(packageDir);
    if (!built.ok) return built;
  }
  const targetDir = join(localPackagesDir(), unscoped(packageName));
  mkdirSync(targetDir, { recursive: true });
  for (const file of COPY_FILES) {
    const source = join(packageDir, file);
    if (existsSync(source)) cpSync(source, join(targetDir, file), { recursive: true });
  }
  upsertInsert(packageName);
  return { ok: true, message: `\u5DF2\u5B89\u88C5 ${packageName}`, restartRequired: true };
}
var INSTALL_TIMEOUT_MS = 6e5;
var BUILD_TIMEOUT_MS = 6e5;
function findWorkspaceRoot(packageDir) {
  let cursor = packageDir;
  for (let depth = 0; cursor !== null && depth < 3; depth += 1) {
    if (existsSync(join(cursor, "pnpm-workspace.yaml"))) return cursor;
    cursor = dirname(cursor) === cursor ? null : dirname(cursor);
  }
  return null;
}
function runPnpm(args, cwd, timeoutMs) {
  const command = process.platform === "win32" ? `${process.env.ComSpec ?? "cmd.exe"} /c pnpm ${args.map((a) => `"${a.replace(/"/g, '""')}"`).join(" ")}` : `pnpm ${args.join(" ")}`;
  try {
    execFileSync(command, { cwd, timeout: timeoutMs, stdio: "pipe", windowsHide: true, shell: true });
    return { ok: true };
  } catch (error) {
    const err = error;
    const tail = [err.stdout, err.stderr].filter((part) => part !== void 0 && String(part).trim().length > 0).map(String).join("\n").trim().split(/\r?\n/).slice(-8).join("\n");
    return { ok: false, error: tail.length > 0 ? tail : String(err.message ?? "unknown error") };
  }
}
function allowBuildScripts(installDir) {
  const workspacePath = join(installDir, "pnpm-workspace.yaml");
  const KEY = "dangerouslyAllowAllBuilds: true";
  if (existsSync(workspacePath)) {
    const content = readFileSync(workspacePath, "utf8");
    if (!content.includes("dangerouslyAllowAllBuilds")) {
      writeFileSync(workspacePath, `${content.replace(/\s+$/, "")}
${KEY}
`);
    }
  } else {
    writeFileSync(workspacePath, `${KEY}
`);
  }
}
function ensureBuilt(packageDir) {
  const manifest = readManifest(packageDir);
  const scripts = manifest?.scripts ?? {};
  const scriptName = typeof scripts.build === "string" ? "build" : typeof scripts.bundle === "string" ? "bundle" : void 0;
  if (scriptName === void 0) {
    return { ok: false, message: "\u8BE5\u63D2\u4EF6\u6CA1\u6709\u9884\u6784\u5EFA\u4EA7\u7269\uFF08lib/\uFF09\uFF0C\u4E5F\u6CA1\u6709 build/bundle \u6784\u5EFA\u811A\u672C\uFF0C\u65E0\u6CD5\u81EA\u52A8\u6784\u5EFA" };
  }
  const workspaceRoot = findWorkspaceRoot(packageDir);
  const installDir = workspaceRoot ?? packageDir;
  if (!existsSync(join(installDir, "node_modules"))) {
    allowBuildScripts(installDir);
    const installed = runPnpm(["install"], installDir, INSTALL_TIMEOUT_MS);
    if (!installed.ok) {
      return { ok: false, message: `\u4F9D\u8D56\u5B89\u88C5\u5931\u8D25\uFF08${installDir}\uFF09\uFF1A${installed.error}` };
    }
  }
  const built = runPnpm(["run", scriptName], packageDir, BUILD_TIMEOUT_MS);
  if (!built.ok) {
    return { ok: false, message: `\u6784\u5EFA\u5931\u8D25\uFF08pnpm run ${scriptName}\uFF09\uFF1A${built.error}` };
  }
  if (!existsSync(join(packageDir, "lib", "index.js"))) {
    return { ok: false, message: "\u6784\u5EFA\u7ED3\u675F\u4F46\u672A\u4EA7\u51FA lib/index.js\uFF0C\u8BF7\u68C0\u67E5\u8BE5\u63D2\u4EF6\u7684\u6784\u5EFA\u811A\u672C" };
  }
  return { ok: true, message: "\u5DF2\u81EA\u52A8\u6784\u5EFA\uFF08lib/ \u7531 pnpm install + build \u751F\u6210\uFF09" };
}
function installFromRepo(repo, id) {
  const packageDir = join(repo, "packages", id);
  const manifest = readManifest(packageDir);
  if (manifest === null || typeof manifest.name !== "string") {
    return { ok: false, message: `\u4ED3\u5E93\u4E2D\u627E\u4E0D\u5230 packages/${id}` };
  }
  return installFromDir(packageDir, manifest.name);
}
function installFromGit(url) {
  if (!/^https:\/\//.test(url.trim())) {
    return { ok: false, message: "\u8BF7\u8F93\u5165 https:// \u5F00\u5934\u7684 git \u4ED3\u5E93\u5730\u5740" };
  }
  const tmpRoot = join(dshHome(), ".market-tmp");
  mkdirSync(tmpRoot, { recursive: true });
  const cloneDir = join(tmpRoot, `clone-${Date.now()}`);
  try {
    execFileSync("git", ["clone", "--depth", "1", url.trim(), cloneDir], { stdio: "ignore", timeout: 18e4, windowsHide: true });
  } catch {
    return { ok: false, message: "git clone \u5931\u8D25\uFF08\u7F51\u7EDC\u6216\u5730\u5740\u95EE\u9898\uFF09" };
  }
  try {
    const packagesDir = join(cloneDir, "packages");
    const candidates = existsSync(packagesDir) ? readdirSync(packagesDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => join(packagesDir, entry.name)) : [cloneDir];
    const first = candidates.map((dir) => ({ dir, manifest: readManifest(dir) })).find((entry) => entry.manifest !== null && typeof entry.manifest.name === "string");
    if (first === void 0) return { ok: false, message: "\u514B\u9686\u7684\u5185\u5BB9\u91CC\u6CA1\u6709\u63D2\u4EF6\u5305\uFF08package.json\uFF09" };
    return installFromDir(first.dir, String(first.manifest.name));
  } finally {
    rmSync(cloneDir, { recursive: true, force: true });
  }
}
function uninstall(packageName) {
  if (!isInstalled(packageName)) {
    return { ok: false, message: `${packageName} \u672A\u5B89\u88C5` };
  }
  removeInsert(packageName);
  rmSync(join(localPackagesDir(), unscoped(packageName)), { recursive: true, force: true });
  return { ok: true, message: `\u5DF2\u5378\u8F7D ${packageName}`, restartRequired: true };
}

// src/index.ts
var name = "dsh-market";
var inject = ["webServer"];
function writeJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(body);
}
async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 64 * 1024) return null;
    chunks.push(buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}
function apply(ctx) {
  ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-market/catalog",
    handler: (_req, res) => {
      try {
        writeJson(res, 200, catalog());
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-market/install",
    handler: async (req, res) => {
      let result;
      try {
        const request = await readJson(req);
        if (request === null) {
          result = { ok: false, message: "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF" };
        } else if (request.kind === "repo") {
          const repo = resolveRepo();
          if (repo === null) result = { ok: false, message: "\u672A\u914D\u7F6E\u63D2\u4EF6\u4ED3\u5E93\uFF08\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF DSH_MARKET_REPO\uFF09" };
          else result = installFromRepo(repo, request.id);
        } else {
          result = installFromGit(request.url);
        }
      } catch (error) {
        result = { ok: false, message: error instanceof Error ? error.message : String(error) };
      }
      writeJson(res, result.ok ? 200 : 400, result);
    }
  });
  ctx.webServer.register({
    kind: "exact",
    path: "/api/dsh-market/uninstall",
    handler: async (req, res) => {
      let result;
      try {
        const request = await readJson(req);
        result = request === null || typeof request.id !== "string" ? { ok: false, message: "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF" } : uninstall(request.id);
      } catch (error) {
        result = { ok: false, message: error instanceof Error ? error.message : String(error) };
      }
      writeJson(res, result.ok ? 200 : 400, result);
    }
  });
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
