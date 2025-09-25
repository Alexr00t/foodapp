@echo off
title FoodApp v2 - Jurnal Calorii & Nutrienti
echo.
echo ========================================
echo    FoodApp v2 - Jurnal Calorii & Nutrienti
echo ========================================
echo.
echo Starting server...
echo.

REM Set working directory to the script location
cd /d "%~dp0"

REM Start server in background
start /b python -m http.server 8000

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Open browser automatically
echo Opening browser...
start http://localhost:8000

echo.
echo ========================================
echo Server is running at: http://localhost:8000
echo.
echo The application will automatically load data from JSON files.
echo.
echo Press any key to stop the server...
echo ========================================
pause >nul

REM Kill the server process
taskkill /f /im python.exe >nul 2>&1
echo.
echo Server stopped.
pause
