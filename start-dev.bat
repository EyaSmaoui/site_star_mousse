@echo off
echo Starting Star Mousse Development Servers...
echo.

start "Backend" cmd /c "cd /d backend && node app.js"
timeout /t 3 /nobreak >nul

start "Frontend" cmd /c "cd /d frontend && npm start"

echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause