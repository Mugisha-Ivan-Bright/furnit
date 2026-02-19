# Password Reset with Nodemailer - Complete Setup Guide

## Overview

The password reset system now uses **Nodemailer** (your custom email server) instead of Supabase's built-in email system. This gives you full control over email delivery and avoids Supabase rate limits.

## How It Works

### Flow Diagram
```
1. User clicks "Forgot Password"
   ↓
2. User enters email → Frontend sends to your email server
   ↓
3. Email server checks if user exists in Supabase
   ↓
4. Email server generates secure token (1-hour expiry)
   ↓
5. Email server sends reset link via Nodemailer
   ↓
6. User clicks link in email → Opens reset password page
   ↓
7. User enters new password → Frontend sends to email server
   ↓
8. Email server verifies token & updates password in Supabase
   ↓
9. Email server sends confirmation email
   ↓
10. User redirected to login page
```

## Setup Instructions

### Step 1: Install Supabase in Email Server

```bash
cd server
npm install @supabase/supabase-js
```

### Step 2: Get Supabase Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **service_role** key (NOT the anon key!)
5. ⚠️ **IMPORTANT**: Keep this key secret! It has admin access.

### Step 3: Update server/.env

Add these lines to `server/.env`:

```env
# Supabase Configuration (for password reset)
SUPABASE_URL=https://gdoncogzvnmkvyxhbjjv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_service_role_key_here` with the service role key from Step 2.

### Step 4: Start the Email Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Email server running on port 3001
✅ Email server is ready to send messages
```

### Step 5: Test Password Reset

1. Start frontend: `npm run dev`
2. Go to http://localhost:5173/forgot-password
3. Enter your email
4. Check your email inbox for reset link
5. Click the link
6. Enter new password
7. Check email for confirmation
8. Login with new password

## Files Modified

### Frontend Files
- `src/pages/ForgotPassword.jsx` - Sends email to your server
- `src/pages/ResetPassword.jsx` - Verifies token & updates password
- `src/utils/emailService.js` - API calls to email server

### Backend Files
- `server/index.js` - Password reset endpoints
- `server/config/email.js` - Email templates
- `server/.env` - Supabase credentials

## API Endpoints

### 1. Send Password Reset Email
```
POST http://localhost:3001/api/email/password-reset
Body: { "email": "user@example.com" }
```

**What it does:**
- Checks if user exists in Supabase
- Generates secure token (1-hour expiry)
- Sends email with reset link
- Stores token in memory

### 2. Verify Reset Token
```
POST http://localhost:3001/api/auth/verify-reset-token
Body: { "token": "abc123..." }
```

**What it does:**
- Checks if token is valid
- Checks if token is expired
- Returns user email

### 3. Reset Password
```
POST http://localhost:3001/api/auth/reset-password
Body: { "token": "abc123...", "newPassword": "newpass123" }
```

**What it does:**
- Verifies token
- Updates password in Supabase using Admin API
- Deletes token (one-time use)
- Returns success

### 4. Send Password Changed Email
```
POST http://localhost:3001/api/email/password-changed
Body: { "email": "user@example.com", "name": "John" }
```

**What it does:**
- Sends confirmation email
- Includes security warning

## Security Features

✅ **Secure Tokens**: Cryptographically secure random tokens
✅ **Token Hashing**: Tokens are hashed before storage
✅ **1-Hour Expiry**: Tokens expire after 1 hour
✅ **One-Time Use**: Tokens are deleted after use
✅ **User Verification**: Checks if user exists before sending email
✅ **Password Validation**: Minimum 6 characters
✅ **Admin API**: Uses Supabase service role for password updates

## Troubleshooting

### Issue: "Failed to send email"
**Solution**: Make sure email server is running
```bash
cd server
npm run dev
```

### Issue: "Invalid or expired token"
**Causes:**
- Token expired (1 hour limit)
- Token already used
- Server restarted (tokens stored in memory)

**Solution**: Request a new password reset

### Issue: "Failed to update password in database"
**Causes:**
- Missing SUPABASE_SERVICE_ROLE_KEY in server/.env
- Wrong service role key
- Supabase connection issue

**Solution**: 
1. Check server/.env has correct SUPABASE_SERVICE_ROLE_KEY
2. Verify key is the service_role key (not anon key)
3. Check server logs for detailed error

### Issue: Email not received
**Solutions:**
1. Check spam folder
2. Verify email server is running
3. Check server logs for errors
4. Test with: `cd server && node test-email.js`

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution**:
```bash
cd server
npm install @supabase/supabase-js
```

## Production Deployment

### 1. Use Redis for Token Storage
Replace in-memory Map with Redis:
```javascript
// Instead of: const resetTokens = new Map();
// Use Redis:
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### 2. Use SendGrid Instead of Gmail
Update `server/.env`:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=YOUR_SENDGRID_API_KEY
```

### 3. Secure Environment Variables
- Never commit .env files
- Use environment variable management (Heroku Config Vars, Railway Variables, etc.)
- Rotate service role key regularly

### 4. Add Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3 // 3 requests per 15 minutes
});

app.post('/api/email/password-reset', resetLimiter, async (req, res) => {
    // ...
});
```

## Testing Checklist

- [ ] Email server starts without errors
- [ ] Can request password reset
- [ ] Reset email received in inbox
- [ ] Reset link opens reset password page
- [ ] Can set new password
- [ ] Password updated in Supabase
- [ ] Confirmation email received
- [ ] Can login with new password
- [ ] Old password no longer works
- [ ] Token expires after 1 hour
- [ ] Token can't be reused

## Email Templates

### Password Reset Email
- Subject: "Reset Your Password - Furnit"
- Contains: Reset link with token
- Expires: 1 hour
- Security warning included

### Password Changed Email
- Subject: "Password Changed Successfully - Furnit"
- Contains: Confirmation message
- Security tips included
- "Didn't make this change?" warning

## Summary

Your password reset system now:
- ✅ Uses Nodemailer (no Supabase email limits)
- ✅ Sends custom branded emails
- ✅ Updates passwords in Supabase database
- ✅ Sends confirmation emails
- ✅ Has secure token system
- ✅ Works completely independently

Just make sure to:
1. Install @supabase/supabase-js in server
2. Add SUPABASE_SERVICE_ROLE_KEY to server/.env
3. Keep email server running
4. Test the complete flow

Your users can now reset their passwords using your custom email system!
