@echo off
title Quantoom Root Platform Launcher
echo =======================================================
echo  ⚛️  QUANTOOM ROOT — QUANTUM + AI + CYBERSECURITY
echo =======================================================
echo Starting Quantoom Root Unified Platform...
echo.

REM Start backend server in a new window
start "Quantoom Root Server" cmd /k "npm run start:server"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start client dev server or open browser
start http://localhost:4000
echo.
echo Platform running at: http://localhost:4000
echo Press any key to exit launcher script...
pause >nul
