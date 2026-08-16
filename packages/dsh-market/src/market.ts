/**
 * Market engine: scans a local plugin repository, installs/uninstalls plugins
 * into the DSH web profile (the @local layout + cordis.patch.yml inserts),
 * and shallow-clones git URLs. The same rules as scripts/install-plugin.mjs
 * keep the two paths interchangeable.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import type { MarketCatalog, MarketPlugin, MarketResult } from './shared.ts'

/** Files copied from a plugin package directory into @local/<pkg>. */
const COPY_FILES = ['lib', 'package.json', 'cordis.patch.yml', 'dsh.plugin.json', 'README.md', 'LICENSE']

/** DSH home (env override, then the default under the user profile). */
export function dshHome(): string {
  return process.env.DSH_HOME ?? join(homedir(), '.dsh')
}

/** The web profile directory. */
export function profileDir(): string {
  return join(dshHome(), 'profiles', 'web')
}

/** The manual-install package seat. */
export function localPackagesDir(): string {
  return join(dshHome(), 'profiles', 'node_modules', '@local')
}

/** The profile's own patch layer (the user-editable insert list). */
export function profilePatchPath(): string {
  return join(profileDir(), 'cordis.patch.yml')
}

/** Resolve the local plugin repository: DSH_MARKET_REPO, then common defaults. */
export function resolveRepo(): string | null {
  const candidates = [
    process.env.DSH_MARKET_REPO,
    join(homedir(), 'dsh-plugin-suite'),
  ].filter((value): value is string => typeof value === 'string' && value.length > 0)
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'packages'))) return resolve(candidate)
  }
  return null
}

/** Read a package.json as a loose record. */
function readManifest(dir: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

/** The unscoped name of an @local/<pkg> package. */
export function unscoped(id: string): string {
  return id.startsWith('@local/') ? id.slice(7) : id
}

/** Names of installed packages (the @local directory contents). */
export function installedPackages(): string[] {
  try {
    return readdirSync(localPackagesDir(), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  } catch {
    return []
  }
}

/** Whether one package is installed (directory present AND patch lists it). */
export function isInstalled(packageName: string): boolean {
  const dir = join(localPackagesDir(), unscoped(packageName))
  if (!existsSync(join(dir, 'package.json'))) return false
  try {
    return readFileSync(profilePatchPath(), 'utf8').includes(`name: '${packageName}'`)
  } catch {
    return false
  }
}

/** Catalog a package directory (repo or cloned git checkout). */
function catalogDir(packageDir: string, source: 'repo' | 'git'): MarketPlugin | null {
  const manifest = readManifest(packageDir)
  if (manifest === null || typeof manifest.name !== 'string') return null
  const built = existsSync(join(packageDir, 'lib', 'index.js'))
  return {
    id: manifest.name,
    name: unscoped(manifest.name),
    description: typeof manifest.description === 'string' ? manifest.description : '',
    version: typeof manifest.version === 'string' ? manifest.version : '',
    source,
    built,
    installed: isInstalled(manifest.name),
  }
}

/** Scan the local plugin repository's packages/ directory. */
export function scanRepo(repo: string): MarketPlugin[] {
  const packagesDir = join(repo, 'packages')
  try {
    return readdirSync(packagesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => catalogDir(join(packagesDir, entry.name), 'repo'))
      .filter((plugin): plugin is MarketPlugin => plugin !== null)
  } catch {
    return []
  }
}

/** Build the full catalog response. */
export function catalog(): MarketCatalog {
  const repo = resolveRepo()
  const plugins = repo === null ? [] : scanRepo(repo)
  plugins.sort((a, b) => a.name.localeCompare(b.name))
  return { repo, plugins }
}

/** Split a patch file into its comment header and the YAML body. */
function splitHeader(content: string): { header: string; body: string } {
  const lines = content.split(/\r?\n/)
  const header: string[] = []
  let index = 0
  while (index < lines.length && (lines[index].trim() === '' || lines[index].trimStart().startsWith('#'))) {
    header.push(lines[index])
    index += 1
  }
  return { header: header.join('\n'), body: lines.slice(index).join('\n') }
}

/** Add (or replace) the insert entry for one package in the patch file. */
function upsertInsert(packageName: string): void {
  const patchPath = profilePatchPath()
  const content = readFileSync(patchPath, 'utf8')
  const lines = content.split(/\r?\n/)
  const marker = `name: '${packageName}'`
  const hit = lines.findIndex((line) => line.includes(marker))
  const insert = `- insert:\n    - id: '${packageName}'\n      name: '${packageName}'\n`
  if (hit >= 0) {
    let start = hit
    while (start > 0 && !lines[start].trimStart().startsWith('- insert:')) start -= 1
    lines.splice(start, hit - start + 1)
    const kept = lines.join('\n')
    const { header, body } = splitHeader(kept)
    const trimmed = body.trim()
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${trimmed === '' || trimmed === '[]' ? '' : `${trimmed}\n`}${insert}`, 'utf8')
    return
  }
  const { header, body } = splitHeader(content)
  const trimmed = body.trim()
  if (trimmed === '' || trimmed === '[]') {
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${insert}`, 'utf8')
  } else {
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${trimmed}\n${insert}`, 'utf8')
  }
}

/** Remove the insert entry for one package from the patch file. */
function removeInsert(packageName: string): void {
  const patchPath = profilePatchPath()
  const content = readFileSync(patchPath, 'utf8')
  const lines = content.split(/\r?\n/)
  const marker = `name: '${packageName}'`
  const hit = lines.findIndex((line) => line.includes(marker))
  if (hit < 0) return
  let start = hit
  while (start > 0 && !lines[start].trimStart().startsWith('- insert:')) start -= 1
  lines.splice(start, hit - start + 1)
  writeFileSync(patchPath, lines.join('\n'), 'utf8')
}

/** Copy a built plugin package directory into @local/<pkg>. */
export function installFromDir(packageDir: string, packageName: string): MarketResult {
  if (!existsSync(join(packageDir, 'lib', 'index.js'))) {
    const built = ensureBuilt(packageDir)
    if (!built.ok) return built
  }
  const targetDir = join(localPackagesDir(), unscoped(packageName))
  mkdirSync(targetDir, { recursive: true })
  for (const file of COPY_FILES) {
    const source = join(packageDir, file)
    if (existsSync(source)) cpSync(source, join(targetDir, file), { recursive: true })
  }
  upsertInsert(packageName)
  return { ok: true, message: `已安装 ${packageName}`, restartRequired: true }
}

/** Build timeouts: dependency install and one build script run. */
const INSTALL_TIMEOUT_MS = 600_000
const BUILD_TIMEOUT_MS = 600_000

/** Find the pnpm workspace root above a package dir (max 3 levels up). */
function findWorkspaceRoot(packageDir: string): string | null {
  let cursor: string | null = packageDir
  for (let depth = 0; cursor !== null && depth < 3; depth += 1) {
    if (existsSync(join(cursor, 'pnpm-workspace.yaml'))) return cursor
    cursor = dirname(cursor) === cursor ? null : dirname(cursor)
  }
  return null
}

/** Run pnpm through the platform shell, capturing output for error tails. */
function runPnpm(args: readonly string[], cwd: string, timeoutMs: number): { ok: true } | { ok: false; error: string } {
  const command = process.platform === 'win32'
    ? `${process.env.ComSpec ?? 'cmd.exe'} /c pnpm ${args.map((a) => `"${a.replace(/"/g, '""')}"`).join(' ')}`
    : `pnpm ${args.join(' ')}`
  try {
    execFileSync(command, { cwd, timeout: timeoutMs, stdio: 'pipe', windowsHide: true, shell: true })
    return { ok: true }
  } catch (error) {
    const err = error as { stdout?: Buffer | string; stderr?: Buffer | string; message?: string }
    const tail = [err.stdout, err.stderr]
      .filter((part): part is Buffer | string => part !== undefined && String(part).trim().length > 0)
      .map(String).join('\n').trim().split(/\r?\n/).slice(-8).join('\n')
    return { ok: false, error: tail.length > 0 ? tail : String(err.message ?? 'unknown error') }
  }
}

/**
 * pnpm >= 10 blocks dependency build scripts by default and FAILS `pnpm
 * install` for packages like esbuild. The marketplace installs third-party
 * plugins the user explicitly asked for, so dependency build scripts are
 * allowed in the install directory (pnpm 10+ reads this from
 * pnpm-workspace.yaml, not .npmrc).
 * @param installDir - the directory pnpm install will run in.
 */
function allowBuildScripts(installDir: string): void {
  const workspacePath = join(installDir, 'pnpm-workspace.yaml')
  const KEY = 'dangerouslyAllowAllBuilds: true'
  if (existsSync(workspacePath)) {
    const content = readFileSync(workspacePath, 'utf8')
    if (!content.includes('dangerouslyAllowAllBuilds')) {
      writeFileSync(workspacePath, `${content.replace(/\s+$/, '')}\n${KEY}\n`)
    }
  } else {
    writeFileSync(workspacePath, `${KEY}\n`)
  }
}

/**
 * Auto-build a plugin package that ships no lib/: install dependencies (at
 * the pnpm workspace root when one exists, else in the package) and run the
 * package's build script (scripts.build, falling back to scripts.bundle).
 * @param packageDir - the plugin package directory.
 * @returns ok with the build outcome, or a readable failure.
 */
function ensureBuilt(packageDir: string): MarketResult {
  const manifest = readManifest(packageDir)
  const scripts = (manifest?.scripts ?? {}) as Record<string, string>
  const scriptName = typeof scripts.build === 'string' ? 'build' : typeof scripts.bundle === 'string' ? 'bundle' : undefined
  if (scriptName === undefined) {
    return { ok: false, message: '该插件没有预构建产物（lib/），也没有 build/bundle 构建脚本，无法自动构建' }
  }
  const workspaceRoot = findWorkspaceRoot(packageDir)
  const installDir = workspaceRoot ?? packageDir
  if (!existsSync(join(installDir, 'node_modules'))) {
    // pnpm >= 10 would fail the install on blocked dependency build scripts
    // (esbuild etc.); the user explicitly asked to install this plugin, so
    // allow dependency build scripts in the install directory.
    allowBuildScripts(installDir)
    const installed = runPnpm(['install'], installDir, INSTALL_TIMEOUT_MS)
    if (!installed.ok) {
      return { ok: false, message: `依赖安装失败（${installDir}）：${installed.error}` }
    }
  }
  const built = runPnpm(['run', scriptName], packageDir, BUILD_TIMEOUT_MS)
  if (!built.ok) {
    return { ok: false, message: `构建失败（pnpm run ${scriptName}）：${built.error}` }
  }
  if (!existsSync(join(packageDir, 'lib', 'index.js'))) {
    return { ok: false, message: '构建结束但未产出 lib/index.js，请检查该插件的构建脚本' }
  }
  return { ok: true, message: '已自动构建（lib/ 由 pnpm install + build 生成）' }
}

/** Install one package from the local plugin repository. */
export function installFromRepo(repo: string, id: string): MarketResult {
  const packageDir = join(repo, 'packages', id)
  const manifest = readManifest(packageDir)
  if (manifest === null || typeof manifest.name !== 'string') {
    return { ok: false, message: `仓库中找不到 packages/${id}` }
  }
  return installFromDir(packageDir, manifest.name)
}

/** Shallow-clone a git URL into a temp dir and install its built package. */
export function installFromGit(url: string): MarketResult {
  if (!/^https:\/\//.test(url.trim())) {
    return { ok: false, message: '请输入 https:// 开头的 git 仓库地址' }
  }
  // Clone OUTSIDE profiles/node_modules: pnpm refuses odd things inside a
  // node_modules tree, and the temp dir doubles as a build workspace.
  const tmpRoot = join(dshHome(), '.market-tmp')
  mkdirSync(tmpRoot, { recursive: true })
  const cloneDir = join(tmpRoot, `clone-${Date.now()}`)
  try {
    execFileSync('git', ['clone', '--depth', '1', url.trim(), cloneDir], { stdio: 'ignore', timeout: 180_000, windowsHide: true })
  } catch {
    return { ok: false, message: 'git clone 失败（网络或地址问题）' }
  }
  try {
    // The cloned repo may itself be a workspace root (packages/) or a single
    // plugin package (package.json at the root).
    const packagesDir = join(cloneDir, 'packages')
    const candidates = existsSync(packagesDir)
      ? readdirSync(packagesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(packagesDir, entry.name))
      : [cloneDir]
    const first = candidates.map((dir) => ({ dir, manifest: readManifest(dir) }))
      .find((entry) => entry.manifest !== null && typeof entry.manifest.name === 'string')
    if (first === undefined) return { ok: false, message: '克隆的内容里没有插件包（package.json）' }
    return installFromDir(first.dir, String(first.manifest!.name))
  } finally {
    rmSync(cloneDir, { recursive: true, force: true })
  }
}

/** Uninstall one installed package. */
export function uninstall(packageName: string): MarketResult {
  if (!isInstalled(packageName)) {
    return { ok: false, message: `${packageName} 未安装` }
  }
  removeInsert(packageName)
  rmSync(join(localPackagesDir(), unscoped(packageName)), { recursive: true, force: true })
  return { ok: true, message: `已卸载 ${packageName}`, restartRequired: true }
}
