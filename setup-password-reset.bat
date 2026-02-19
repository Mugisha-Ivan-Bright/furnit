@echo off
echo ========================================
echo Password Reset Setup Script
echo ========================================
echo.

echo Step 1: Installing @supabase/supabase-js in server...
cd server
call npm install @supabase/supabase-js
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Add your SUPABASE_SERVICE_ROLE_KEY to server/.env
echo 2. Start email server: cd server ^&^& npm run dev
echo 3. Test password reset flow
echo.
echo See NODEMAILER_PASSWORD_RESET_COMPLETE.md for details
echo.
pause
