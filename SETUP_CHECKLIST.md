# ✅ Password Reset Setup Checklist

## Before You Start

Make sure you have:
- [ ] Email server files in `server/` directory
- [ ] Gmail app password configured in `server/.env`
- [ ] Supabase project created
- [ ] Node.js and npm installed

## Setup Steps

### 1. Install Dependencies
- [ ] Run: `cd server`
- [ ] Run: `npm install @supabase/supabase-js`
- [ ] Verify: Check `server/node_modules/@supabase` exists

### 2. Get Supabase Service Role Key
- [ ] Go to https://supabase.com/dashboard
- [ ] Select your project
- [ ] Click **Settings** (gear icon)
- [ ] Click **API** in sidebar
- [ ] Scroll to **Project API keys**
- [ ] Copy the **service_role** key (NOT the anon key!)
- [ ] ⚠️ Keep this key secret!

### 3. Update server/.env
- [ ] Open `server/.env`
- [ ] Find the line: `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE`
- [ ] Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual key
- [ ] Save the file
- [ ] Verify: `SUPABASE_URL` is also set correctly

Example `server/.env`:
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mugishaivanbright250@gmail.com
EMAIL_PASSWORD=pkew edgz nvxp sryk
EMAIL_FROM=Furnit <mugishaivanbright250@gmail.com>

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Supabase Configuration (for password reset)
SUPABASE_URL=https://gdoncogzvnmkvyxhbjjv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Start Email Server
- [ ] Open terminal
- [ ] Run: `cd server`
- [ ] Run: `npm run dev`
- [ ] Verify you see:
  ```
  🚀 Email server running on port 3001
  ✅ Email server is ready to send messages
  ```
- [ ] Keep this terminal open!

### 5. Start Frontend (New Terminal)
- [ ] Open new terminal
- [ ] Run: `npm run dev`
- [ ] Verify frontend starts on http://localhost:5173

## Testing

### Test 1: Request Password Reset
- [ ] Go to http://localhost:5173/forgot-password
- [ ] Enter your email address
- [ ] Click "Send Reset Link"
- [ ] Verify: "Check Your Email" message appears
- [ ] Check email server logs for: `✅ Password reset email sent to...`

### Test 2: Check Email
- [ ] Open your email inbox
- [ ] Find email with subject: "Reset Your Password - Furnit"
- [ ] Verify email has reset link
- [ ] Verify email looks good (branded, professional)

### Test 3: Reset Password
- [ ] Click the reset link in email
- [ ] Verify: Opens http://localhost:5173/reset-password?token=...
- [ ] Enter new password (min 6 characters)
- [ ] Enter same password in "Confirm Password"
- [ ] Click "Reset Password"
- [ ] Verify: "Password Reset!" success message
- [ ] Check email server logs for: `✅ Password updated successfully for...`

### Test 4: Confirmation Email
- [ ] Check your email inbox again
- [ ] Find email with subject: "Password Changed Successfully - Furnit"
- [ ] Verify email has confirmation message
- [ ] Verify security warning is present

### Test 5: Login with New Password
- [ ] Wait for redirect to login page (or click "Continue to Login")
- [ ] Enter your email
- [ ] Enter your NEW password
- [ ] Click "Sign In"
- [ ] Verify: Successfully logged in ✅

### Test 6: Old Password Doesn't Work
- [ ] Logout
- [ ] Try to login with OLD password
- [ ] Verify: Login fails (password incorrect)

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
cd server
npm install @supabase/supabase-js
```

### Issue: "Failed to update password in database"
**Causes:**
- Missing or wrong SUPABASE_SERVICE_ROLE_KEY
- Wrong Supabase URL

**Solution:**
1. Check `server/.env` has SUPABASE_SERVICE_ROLE_KEY
2. Verify it's the **service_role** key (not anon key)
3. Check SUPABASE_URL matches your project

### Issue: "Failed to send email"
**Solution:**
- Make sure email server is running: `cd server && npm run dev`
- Check server logs for errors
- Test email: `cd server && node test-email.js`

### Issue: Email not received
**Solutions:**
1. Check spam/junk folder
2. Verify email server is running
3. Check server logs for "✅ Password reset email sent"
4. Try different email address

### Issue: "Invalid or expired token"
**Causes:**
- Token expired (1 hour limit)
- Token already used
- Server restarted (tokens in memory)

**Solution:**
- Request new password reset

## Production Checklist

Before deploying to production:

- [ ] Use Redis for token storage (not in-memory)
- [ ] Use SendGrid instead of Gmail
- [ ] Add rate limiting (max 3 requests per 15 minutes)
- [ ] Add logging/monitoring
- [ ] Secure environment variables
- [ ] Test with real users
- [ ] Set up email deliverability (SPF, DKIM, DMARC)
- [ ] Add error tracking (Sentry, etc.)

## Success Criteria

You're done when:
- ✅ Email server starts without errors
- ✅ Can request password reset
- ✅ Reset email received in inbox
- ✅ Can click link and set new password
- ✅ Password updated in Supabase
- ✅ Confirmation email received
- ✅ Can login with new password
- ✅ Old password doesn't work

## Need Help?

Check these files:
- `README_PASSWORD_RESET.md` - Quick overview
- `NODEMAILER_PASSWORD_RESET_COMPLETE.md` - Complete guide
- `PASSWORD_RESET_SETUP.md` - Detailed setup
- `EMAIL_TROUBLESHOOTING.md` - Email issues

## Summary

Your password reset system is ready! Just:
1. Install @supabase/supabase-js
2. Add service role key to server/.env
3. Start email server
4. Test the flow

That's it! 🎉
