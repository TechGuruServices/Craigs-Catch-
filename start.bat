@echo off
echo ========================================================
echo                Premium Craigs-Catch Launcher
echo ========================================================
cd /d "c:\Apps\Craigs-Catch"

echo [1/3] Ensuring database is properly synchronized...
call npm run db:push

echo [2/3] Opening your premium dashboard...
set "APP_PORT=5000"
if exist .env (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        if /i "%%a"=="PORT" set "APP_PORT=%%b"
    )
)
start http://localhost:%APP_PORT%

echo [3/3] Launching background services...
npm run dev
pause
