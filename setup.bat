@echo off
REM 🚀 Star Mousse - Setup & Diagnostic Script
REM This script helps diagnose and setup your environment

echo ======================================
echo   STAR MOUSSE - SETUP & DIAGNOSTICS
echo ======================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js NOT FOUND - Install from nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js: 
    node --version
)
echo.

REM Check npm
echo [2/5] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm NOT FOUND
    pause
    exit /b 1
) else (
    echo ✅ npm:
    npm --version
)
echo.

REM Check MongoDB local
echo [3/5] Checking MongoDB local...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MongoDB NOT installed locally
    echo    → Use MongoDB Atlas (Cloud) OR
    echo    → Use Docker: docker run -d -p 27017:27017 mongo:latest
) else (
    echo ✅ MongoDB:
    mongod --version | findstr /C:"mongod version"
)
echo.

REM Check ports
echo [4/5] Checking available ports...
netstat -ano | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 3000 is in use
) else (
    echo ✅ Port 3000 available
)

netstat -ano | findstr ":5000" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port 5000 is in use
) else (
    echo ✅ Port 5000 available
)
echo.

REM Check environment file
echo [5/5] Checking environment files...
if exist ".env" (
    echo ✅ .env found
) else (
    echo ❌ .env NOT found - copy .env.example or create one
)
echo.

echo ======================================
echo  NEXT STEPS:
echo ======================================
echo 1. Configure MongoDB (see SETUP_GUIDE.md)
echo 2. Run: npm install --prefix backend
echo 3. Run: npm install --prefix frontend
echo 4. Run: npm run dev
echo 5. In another terminal: npm start --prefix frontend
echo.
echo For more help, see README.md and SETUP_GUIDE.md
echo.
pause
