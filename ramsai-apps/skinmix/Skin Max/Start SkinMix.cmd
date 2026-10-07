@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto missing
echo.
echo SkinMix - your skin, your mix.
echo Open http://127.0.0.1:5173 in your browser.
echo Keep this window open while using the app. Press Ctrl+C to stop.
echo.
node scripts/server.mjs
pause
exit /b
:missing
echo Node.js is required. Install Node.js 20 or newer, then try again.
pause
