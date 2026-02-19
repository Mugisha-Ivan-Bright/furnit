# 🔐 Custom Password Reset with Nodemailer

## ✅ Implementation Complete!

Your password reset system now uses **Nodemailer** (your custom email server) instead of Supabase's built-in email system.

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependency
```bash
cd server
npm install @supabase/supabase-js
```

Or run the setup script:
```bash
setup-password-reset.bat
```

### Step 2: Add Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **service_role** key (⚠️ keep it secret!)
5. Add to `server/.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Start Email Server
```bash
cd server
npm run dev
```

That's it! Your password reset is ready to use.

## 📧 How It Works

1. **User forgets password** → Goes to `/forgot-password`
2. **Enters email** → Your server checks if user exists
3. **Receives email** → With secure reset link (1-hour expiry)
4. **Clicks link** → Opens `/reset-password?token=abc123`
5. **Enters new password** → Your server updates Supabase
6. **Receives confirmation** → Email confirms password changed
7. **Logs in** → With new password ✅

## 🎯 What's Different Now

### Before (Supabase Emails)
- ❌ Rate limited (3 emails per hour)
- ❌ Generic Supabase branding
- ❌ No control over email content
- ❌ Can't customize flow

### After (Your Nodemailer Server)
- ✅ No rate limits (uses your Gmail/SMTP)
- ✅ Custom branded emails
- ✅ Full control over content
- ✅ Custom flow and logic
- ✅ Password updated in Supabase database

## 📁 Files Modified

### Backend
- `server/index.js` - Password reset endpoints + Supabase integration
- `server/config/email.js` - Password changed email template
- `server/.env` - Supabase credentials (you need to add service key)

### Frontend
- `src/pages/ForgotPassword.jsx` - Uses your email server
- `src/pages/ResetPassword.jsx` - Verifies token & resets via your server
- `src/utils/emailService.js` - API functions

## 🔒 Security

- ✅ Cryptographically secure tokens
- ✅ Tokens hashed before storage
- ✅ 1-hour expiration
- ✅ One-time use (deleted after use)
- ✅ User verification in Supabase
- ✅ Password validation (min 6 chars)
- ✅ Supabase Admin API for secure updates

## 🧪 Testing

1. Start email server: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Go to http://localhost:5173/forgot-password
4. Enter your email
5. Check inbox for reset link
6. Click link and set new password
7. Check inbox for confirmation
8. Login with new password

## 📚 Documentation

- **NODEMAILER_PASSWORD_RESET_COMPLETE.md** - Complete overview
- **PASSWORD_RESET_SETUP.md** - Detailed setup guide
- **setup-password-reset.bat** - Automated setup script

## ⚠️ Important Notes

1. **Service Role Key**: Keep it secret! It has admin access to your Supabase.
2. **Email Server**: Must be running for password reset to work.
3. **Token Storage**: Currently in-memory (use Redis in production).
4. **Gmail Limits**: Gmail has daily sending limits (use SendGrid for production).

## 🎉 You're Done!

Your password reset system is now:
- Using your custom email server
- Sending branded emails
- Updating passwords in Supabase
- Completely independent of Supabase emails

Just install the dependency, add your service role key, and start the email server!

---

**Questions?** Check the detailed guides in:
- `NODEMAILER_PASSWORD_RESET_COMPLETE.md`
- `PASSWORD_RESET_SETUP.md`
