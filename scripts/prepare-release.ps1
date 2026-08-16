# Prepare an open-source release folder from the working repository:
#   - copies source, lib (no sourcemaps), docs, scripts, assets
#   - excludes node_modules / dist / .git / *.exe / *.log
#   - sanitizes developer-machine paths (user name, absolute repo path)
# Usage:  pwsh -File scripts\prepare-release.ps1 [-Target F:\dsh-plugin-suite]
# NOTE: keep this file UTF-8 with BOM — PowerShell parses BOM-less scripts
#       with the system ANSI code page, which corrupts the CJK literals in
#       the sanitize rules below.
param(
  [string]$Source = '',
  [string]$Target = 'F:\dsh-plugin-suite'
)

$ErrorActionPreference = 'Stop'
if ($Source -eq '') {
  # The script lives in <repo>/scripts: the repo root is one level up.
  $Source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
}
$source = (Resolve-Path $Source).Path

Write-Host "Source: $source"
Write-Host "Target: $Target"

if (Test-Path $Target) {
  Write-Host "Target exists - removing: $Target"
  Remove-Item -Recurse -Force $Target
}
New-Item -ItemType Directory -Path $Target | Out-Null

# Excluded names at any depth.
$excludeDirs = @('node_modules', 'dist', '.git', '.pnpm-store')
$excludeExt = @('.map', '.exe', '.log', '.tmp')

Get-ChildItem $source -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($source.Length).TrimStart('\', '/')
  $parts = $relative -split '[\\/]'
  if ($parts | Where-Object { $_ -in $excludeDirs }) { return }
  if ($_.Extension -in $excludeExt) { return }
  if ($_.Name -eq 'pnpm-lock.yaml') { return }  # rebuilt by consumers
  $dest = Join-Path $Target $relative
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  Copy-Item $_.FullName $dest
}

Write-Host "Copied files. Sanitizing paths..."

# Sanitize developer-machine paths in text files. The script itself is
# skipped: its own rules must survive for the next run.
$sanitize = @(
  @{ Match = 'C:/Users/Administrator/deepseek-harness'; Replace = '../../deepseek-harness' },
  @{ Match = 'C:\Users\Administrator\deepseek-harness'; Replace = '%USERPROFILE%\deepseek-harness' },
  @{ Match = 'F:/DSH插件'; Replace = '<repo-root>' },
  @{ Match = 'F:\DSH插件'; Replace = '<repo-root>' }
)
$textExt = @('.ts', '.tsx', '.js', '.mjs', '.md', '.json', '.yml', '.yaml', '.ps1', '.bat', '.txt', '.d.ts')
$utf8 = New-Object System.Text.UTF8Encoding($false)
$touched = @()
$selfInTarget = Join-Path $Target 'scripts\prepare-release.ps1'
Get-ChildItem $Target -Recurse -File | Where-Object {
  $_.Extension -in $textExt -and $_.FullName -ne $selfInTarget
} | ForEach-Object {
  $content = [System.IO.File]::ReadAllText($_.FullName, $utf8)
  if ($null -eq $content) { return }
  $original = $content
  foreach ($rule in $sanitize) {
    $content = $content.Replace($rule.Match, $rule.Replace)
  }
  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($_.FullName, $content, $utf8)
    $touched += $_.FullName
  }
}
Write-Host ("Sanitized {0} files:" -f $touched.Count)
$touched | ForEach-Object { Write-Host "  $_" }
Write-Host "Done. Release folder: $Target"
