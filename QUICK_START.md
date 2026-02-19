# Quick Start Guide

## Current Status

✅ **Authentication**: Working (uses Supabase)
✅ **Orders**: Working (saves to Supabase)
✅ **Password Reset**: Working (uses Supabase)
⚠️ **Order Confirmation Emails**: Requires email server (optional)

## Running the App

### Option 1: Without Email Server (Simplest)

```bash
# Just run the frontend
npm run dev
```

**What works:**
- ✅ All authentication (signup, login, logout)
- ✅ All shopping features (cart, checkout, orders)
- ✅ Password reset (via Supabase)
- ❌ Order confirmation emails (will fail silently)

### Option 2: With Email Server (Full Features)

```bash
# Terminal 1: Start email server
cd server
npm install
npm run dev

# Terminal 2: Start frontend
npm run dev
```

**What works:**
- ✅ Everything from Option 1
- ✅ Order confirmation emails sent to customers

## Email Server Setup (Optional)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Create `.env` File
Create `server/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Furnit <your-email@gmail.com>
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Create app password for "Mail"
5. Copy the 16-character password
6. Paste in `EMAIL_PASSWORD` in `.env`

### 4. Start Email Server
```bash
cd server
npm run dev
```

You should see:
```
🚀 Email server running on port 3001
✅ Email server is ready to send messages
```

## Fixing "Failed to Fetch" Error

This error appears when:
1. Email server is not running
2. Wrong port or URL

### Solution:

**For Password Reset:**
- Already fixed! Now uses Supabase (no email server needed)

**For Order Confirmations:**
- Either start the email server (see above)
- Or ignore the error (orders still work, just no email)

## Supabase Setup

### Disable Email Confirmation (Important!)

1. Go to https://supabase.com/dashboard
2. Select your project
3. **Authentication** → **Providers** → **Email**
4. Turn **OFF** "Confirm email"
5. Click **Save**

This prevents Supabase email rate limit issues.

## Testing

### Test Without Email Server
1. Start frontend: `npm run dev`
2. Sign up / Login
3. Add items to cart
4. Complete checkout
5. Order saved ✅
6. Email fails silently ❌ (but order still works!)

### Test With Email Server
1. Start email server: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Complete checkout
4. Check your email inbox
5. Order confirmation received ✅

## Troubleshooting

### "Failed to fetch" on Forgot Password
**Fixed!** Now uses Supabase password reset.

### "Failed to fetch" on Checkout
**Not a problem!** Order still saves, just no email sent.

**To fix:**
1. Start email server: `cd server && npm run dev`
2. Verify it's running on port 3001
3. Try checkout again

### Email server won't start
```bash
cd server
npm install  # Install dependencies first
npm run dev
```

### Gmail authentication error
- Use app password, not account password
- Enable 2-Step Verification first
- Generate new app password

## Production Deployment

### Frontend Only (No Emails)
- Deploy React app to Vercel/Netlify
- Orders work, no emails sent

### Frontend + Email Server
- Deploy React app to Vercel/Netlify
- Deploy email server to:
  - Heroku
  - Railway
  - DigitalOcean
  - AWS/GCP
- Update `VITE_EMAIL_API_URL` to production URL

### Recommended: Use SendGrid
Instead of running your own email server:
1. Sign up for SendGrid (free tier)
2. Get API key
3. Update `server/.env` with SendGrid credentials
4. Deploy email server

## Summary

**Minimum to run app:**
```bash
npm run dev
```

**Full features (with emails):**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
npm run dev
```

**Current issue fixed:**
- Password reset now uses Supabase (no email server needed)
- Order confirmations optional (app works without email server)

Your app is ready to use! Email server is optional for order confirmations.
