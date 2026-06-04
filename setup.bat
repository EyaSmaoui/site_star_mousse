@echo off
setlocal

echo ======================================
echo   STAR MOUSSE - SETUP ET DIAGNOSTIC
echo ======================================
echo.

echo [1/5] Verification de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js est introuvable. Installe Node.js 18 ou plus.
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('node --version') do echo Node.js: %%v
)
echo.

echo [2/5] Verification de npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: npm est introuvable.
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('npm --version') do echo npm: %%v
)
echo.

echo [3/5] Verification de MongoDB local...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo INFO: MongoDB local n'est pas installe.
    echo Utilise MongoDB Atlas ou Docker si tu n'as pas MongoDB local.
) else (
    mongod --version | findstr /C:"db version" /C:"mongod version"
)
echo.

echo [4/5] Verification des ports...
netstat -ano | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo Port 3000: occupe
) else (
    echo Port 3000: libre
)

netstat -ano | findstr ":5000" >nul 2>&1
if not errorlevel 1 (
    echo Port 5000: occupe
) else (
    echo Port 5000: libre
)
echo.

echo [5/5] Verification des fichiers environnement...
if exist "backend\.env" (
    echo backend\.env: trouve
) else (
    echo backend\.env: manquant, copie backend\.env.example puis configure-le.
)
if exist ".env" (
    echo .env racine: trouve
) else (
    echo .env racine: optionnel/manquant
)
echo.

echo ======================================
echo   COMMANDES UTILES
echo ======================================
echo Installer tout: npm run install:all
echo Lancer backend + frontend: npm run dev:all
echo Build production: npm run build
echo Backend seul: npm start
echo Frontend seul: npm start --prefix frontend
echo.
pause
