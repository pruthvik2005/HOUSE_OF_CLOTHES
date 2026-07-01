@echo off
title House of Clothes Local Server
echo Checking for conflicting processes on port 8080...
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue"

echo =======================================================
echo House of Clothes Local Server
echo =======================================================
echo.
echo Website is opening on your computer at:
echo   http://localhost:8080
echo.
echo To open it on your mobile phone:
echo 1. Connect your phone to the SAME Wi-Fi network as this PC.
echo 2. Open one of these URLs on your phone's browser:
for /f "usebackq tokens=*" %%i in (`powershell -Command "((Get-NetIPAddress -AddressFamily IPv4).IPAddress -notlike '127.*' -notlike '169.254.*')"`) do (
    echo   http://%%i:8080
)
echo.
echo =======================================================
echo.

start "" "http://localhost:8080"
python -m http.server 8080
pause


