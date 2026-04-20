@echo off
echo === PLC Temperature Monitor Setup (Windows) ===
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js not found. Installing...
    echo.

    :: Download Node.js LTS installer
    echo Downloading Node.js LTS...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v22.17.0/node-v22.17.0-x64.msi' -OutFile '%TEMP%\node-install.msi'"

    :: Install silently
    echo Installing Node.js...
    msiexec /i "%TEMP%\node-install.msi" /qn

    :: Refresh PATH
    set "PATH=%ProgramFiles%\nodejs;%PATH%"

    :: Verify
    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo.
        echo Auto-install failed. Please install manually:
        echo https://nodejs.org/en/download
        echo.
        echo After installing, re-run this script.
        pause
        exit /b 1
    )
)

echo Node.js: 
node -v
echo.

:: Install dependencies
echo Installing dependencies...
call npm install
echo.

:: Build
echo Building project...
call npm run build
echo.

echo === Setup Complete ===
echo.
echo PLC Config:
echo   Host: 192.168.10.254
echo   Port: 102 (S7)
echo   Rack: 0, Slot: 2
echo   Address: VM1 (DB1,REAL0)
echo.
echo Run:
echo   npm run dev    (development http://localhost:3000)
echo   npm run start  (production  http://localhost:3000)
echo.
pause
