/**
 * Install one built plugin package into the DSH web profile.
 *
 * Uses the ecosystem-proven manual layout (dsh-bg-image method A): the built
 * package lands at $DSH_HOME/profiles/node_modules/@local/<name>/ and one
 * insert entry is appended to the profile's cordis.patch.yml. No pnpm, no
 * registry round-trip — Node's upward resolution finds @local from the
 * profile directory, and dsh-client-modules discovers the browser half
 * through the package's `dsh.client` declaration.
 *
 * Usage:
 *   node scripts/install-plugin.mjs <package-dir> [--profile web] [--dsh-home <path>]
 *
 * A running dsh web server does not reload its profile plugin list — restart
 * the server (or start a fresh instance, e.g. `pnpm dsh web --port 3081`) and
 * hard-refresh the browser.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'

function fail(message) {
  console.error(`[install-plugin] ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const options = { profile: 'web', dshHome: undefined, packageDir: undefined }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--profile') {
      options.profile = argv[++index]
      if (options.profile === undefined) fail('--profile needs a name')
    } else if (arg === '--dsh-home') {
      options.dshHome = argv[++index]
      if (options.dshHome === undefined) fail('--dsh-home needs a path')
    } else if (options.packageDir === undefined) {
      options.packageDir = resolve(arg)
    } else {
      fail(`unknown argument ${JSON.stringify(arg)}`)
    }
  }
  if (options.packageDir === undefined) fail('usage: node scripts/install-plugin.mjs <package-dir> [--profile web] [--dsh-home <path>]')
  return options
}

/** The patch file's own comment header, if present. */
function splitHeader(content) {
  const lines = content.split(/\r?\n/)
  const header = []
  let index = 0
  while (index < lines.length && (lines[index].trim() === '' || lines[index].trimStart().startsWith('#'))) {
    header.push(lines[index])
    index += 1
  }
  return { header: header.join('\n'), body: lines.slice(index).join('\n') }
}

/**
 * Append (or replace) the insert entry for one plugin in the patch file.
 * The entry id equals the loader entry name (== package name); an existing
 * insert for the same package name (any id spelling) is replaced, so
 * re-installs after renames never leave duplicate entries.
 */
function appendInsert(patchPath, entryId, packageName) {
  const content = readFileSync(patchPath, 'utf8')
  const lines = content.split(/\r?\n/)
  const marker = `name: '${packageName}'`
  const hit = lines.findIndex((line) => line.includes(marker))
  if (hit >= 0) {
    // Remove the insert block owning that name line (walk back to its
    // `- insert:` header).
    let start = hit
    while (start > 0 && !lines[start].trimStart().startsWith('- insert:')) start -= 1
    lines.splice(start, hit - start + 1)
    const kept = lines.join('\n')
    const { header, body } = splitHeader(kept)
    const insert = `- insert:\n    - id: '${entryId}'\n      name: '${packageName}'\n`
    const trimmedBody = body.trim()
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${trimmedBody === '' || trimmedBody === '[]' ? '' : `${trimmedBody}\n`}${insert}`, 'utf8')
    console.log(`[install-plugin] replaced ${entryId} (${packageName}) in ${patchPath}`)
    return
  }
  const { header, body } = splitHeader(content)
  const insert = `- insert:\n    - id: '${entryId}'\n      name: '${packageName}'\n`
  const trimmedBody = body.trim()
  if (trimmedBody === '' || trimmedBody === '[]') {
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${insert}`, 'utf8')
  } else {
    // Append to the existing top-level array: keep the body, add the entry.
    writeFileSync(patchPath, `${header}${header.endsWith('\n') || header === '' ? '' : '\n'}${trimmedBody}\n${insert}`, 'utf8')
  }
  console.log(`[install-plugin] inserted ${entryId} (${packageName}) into ${patchPath}`)
}

const options = parseArgs(process.argv.slice(2))
const dshHome = options.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh')
const profileDir = join(dshHome, 'profiles', options.profile)

const manifestPath = join(options.packageDir, 'package.json')
if (!existsSync(manifestPath)) fail(`${options.packageDir} has no package.json`)
if (!existsSync(join(options.packageDir, 'lib', 'index.js'))) fail(`${options.packageDir} has no lib/index.js — run the package build first`)
if (!existsSync(profileDir)) fail(`profile ${options.profile} not found at ${profileDir}`)

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const name = manifest.name
if (typeof name !== 'string' || name.length === 0) fail('package.json has no name')

// @local/<pkg> is the manual-install scope: the package name itself carries
// the scope so the loader entry id (== package name) matches the id the
// bundle registers via __ModuleLoader__.load. The directory under
// profiles/node_modules/@local/ is the unscoped part.
const scopePrefix = '@local/'
const localName = name.startsWith(scopePrefix) ? name.slice(scopePrefix.length) : name
const targetDir = join(dshHome, 'profiles', 'node_modules', '@local', localName)
mkdirSync(targetDir, { recursive: true })

const copyFiles = ['lib', 'package.json', 'cordis.patch.yml', 'dsh.plugin.json', 'README.md', 'LICENSE']
for (const file of copyFiles) {
  const source = join(options.packageDir, file)
  if (existsSync(source)) cpSync(source, join(targetDir, file), { recursive: true })
}
console.log(`[install-plugin] copied ${name} → ${targetDir}`)

appendInsert(join(profileDir, 'cordis.patch.yml'), manifest.entry?.name ?? name, name)

console.log(`\n[install-plugin] ${name} installed into the ${options.profile} profile.`)
console.log('A running dsh web server does not reload its profile plugin list. Restart it (or start')
console.log('a fresh instance, e.g. `pnpm dsh web --port 3081`) and hard-refresh the browser (Ctrl+F5).')
