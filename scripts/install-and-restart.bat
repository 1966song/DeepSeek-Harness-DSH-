@echo off
setlocal EnableExtensions DisableDelayedExpansion

rem dsh-plugin-suite: install all plugins into the web profile, restart dsh web.
rem Run from this repo root:
rem   scripts\install-and-restart.bat [Harness root]
rem Optional argument: the DeepSeek Harness checkout root (default: %CD%).

set "REPO_ROOT=%~dp0.."
set "HARNESS_ROOT=%CD%"
if not "%~1"=="" set "HARNESS_ROOT=%~f1"

if not exist "%HARNESS_ROOT%\package.json" goto :not_harness
if not exist "%REPO_ROOT%\scripts\install-plugin.mjs" goto :missing_scripts

where node >nul 2>nul
if errorlevel 1 goto :missing_node

rem Stop only a dsh web Node process. Do not take over port 3080 from another app.
powershell.exe -NoProfile -Command "$listeners = @(Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue); foreach ($listener in $listeners) { $process = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $listener.OwningProcess); if ($process.Name -ne 'node.exe' -or $process.CommandLine -notmatch 'apps[/\\]cli[/\\]src[/\\]bin\.ts.*web') { Write-Error ('Port 3080 is in use by ' + $process.Name + ' (PID ' + $listener.OwningProcess + '). Refusing to stop a process that is not dsh web.'); exit 2 }; Stop-Process -Id $listener.OwningProcess -Force }; exit 0"
if errorlevel 1 goto :stop_failed

for %%P in (dsh-wallpaper dsh-usage dsh-prompt-rail) do (
  echo.
  echo === Installing %%P ===
  node "%REPO_ROOT%\scripts\install-plugin.mjs" "%REPO_ROOT%\packages\%%P"
  if errorlevel 1 goto :install_failed
)

pushd "%HARNESS_ROOT%"
start "DeepSeek Harness Server" /min "%ComSpec%" /d /s /c "pnpm dsh web"
popd

powershell.exe -NoProfile -Command "$deadline = [DateTime]::UtcNow.AddSeconds(30); do { if (Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue) { exit 0 }; Start-Sleep -Milliseconds 500 } while ([DateTime]::UtcNow -lt $deadline); exit 1"
if errorlevel 1 goto :start_failed

start "" "http://127.0.0.1:3080/"
echo.
echo [OK] All dsh plugins installed and dsh web restarted.
echo If an existing browser tab was open, press Ctrl+F5 once.
exit /b 0

:not_harness
echo [ERROR] "%HARNESS_ROOT%" is not a DeepSeek Harness source checkout.
echo Run this script from the Harness root, or pass that root as the first argument.
exit /b 1

:missing_scripts
echo [ERROR] install-plugin.mjs not found next to this script.
exit /b 1

:missing_node
echo [ERROR] Node.js was not found on PATH.
exit /b 1

:stop_failed
echo [ERROR] Could not safely stop the process on port 3080.
echo Close the existing server manually, then run this script again.
exit /b 1

:install_failed
popd
echo [ERROR] A plugin was not installed. The web server was not restarted.
exit /b 1

:start_failed
popd
echo [ERROR] dsh web did not start on http://127.0.0.1:3080 within 30 seconds.
echo Check the minimized "DeepSeek Harness Server" window for its error output.
exit /b 1
