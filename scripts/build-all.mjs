/**
 * Build every plugin package in this workspace (each package owns its build
 * script; this is the one-command entry point).
 */
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packagesDir = join(root, 'packages')
const names = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules')
  .map((entry) => entry.name)

for (const name of names) {
  const dir = join(packagesDir, name)
  const manifest = JSON.parse(String(await import('node:fs').then(fs => fs.readFileSync(join(dir, 'package.json'), 'utf8'))))
  if (manifest.scripts?.build === undefined) continue
  console.log(`\n=== build ${name} ===`)
  execFileSync(process.execPath, [join(dir, 'build.mjs')], { cwd: dir, stdio: 'inherit' })
}
