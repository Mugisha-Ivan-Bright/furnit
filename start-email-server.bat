@echo off
echo ========================================
echo Starting Email Server
echo ========================================
echo.
echo Make sure you have:
echo 1. Installed dependencies: npm install
echo 2. Configured server/.env with email settings
echo.
echo Starting server on port 3001...
echo.
cd server
npm run dev
