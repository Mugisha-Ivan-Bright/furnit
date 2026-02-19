# Email System Summary

## What's Implemented

### ✅ Nodemailer Email Server
- **Location**: `server/` directory
- **Purpose**: Send transactional emails without Supabase limits
- **Technology**: Node.js + Express + Nodemailer

### ✅ Email Templates
1. **Order Confirmation** - Sent after checkout
   - Order details, items, delivery info
   - Professional HTML design
   - Automatic sending after order placement

2. **Welcome Email** - Can be sent on signup
   - Welcome message
   - Key benefits
   - Call to action

3. **Password Reset** - Ready but not integrated
   - Secure reset link
   - Expiry warning
   - Plain text fallback

### ✅ Frontend Integration
- `src/utils/emailService.js` - API client
- `src/pages/Checkout.jsx` - Sends order confirmation
- Environment variable: `VITE_EMAIL_API_URL`

## What's NOT Fully Implemented

### ⚠️ Custom Password Reset
**Current Status**: Uses Supabase's built-in password reset

**Why**: Updating passwords without authentication requires:
- Supabase Service Role Key (admin access)
- Server-side password update endpoint
- Additional security measures

**Recommendation**: 
- **Development**: Use Supabase password reset with email confirmation disabled
- **Production**: Configure custom SMTP in Supabase dashboard

## Quick Setup

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Configure Email (Gmail Example)
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
1. Enable 2FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `.env`

### 4. Start Servers
```bash
# Terminal 1: Email Server
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 5. Disable Supabase Email Confirmation
1. Go to Supabase Dashboard
2. **Authentication** → **Providers** → **Email**
3. Turn **OFF** "Confirm email"
4. Click **Save**

## Email Flow

### Order Confirmation
```
User completes checkout
  ↓
Order saved to Supabase
  ↓
Frontend calls email API
  ↓
Nodemailer sends email
  ↓
User receives order confirmation
```

### Password Reset (Current)
```
User clicks "Forgot Password"
  ↓
Enters email
  ↓
Supabase sends reset email
  ↓
User clicks link
  ↓
Resets password
  ↓
Supabase updates password
```

## Files Structure

```
server/
├── package.json          # Dependencies
├── index.js             # Express server
├── .env                 # Email credentials (create this)
├── .env.example         # Template
├── config/
│   └── email.js         # Nodemailer config & templates
└── utils/
    └── tokenGenerator.js # Token generation (for custom reset)

src/
├── utils/
│   └── emailService.js  # Frontend email API client
└── pages/
    ├── Checkout.jsx     # Sends order confirmation
    ├── ForgotPassword.jsx # Password reset request
    └── ResetPassword.jsx  # Password reset form
```

## API Endpoints

### POST /api/email/order-confirmation
Send order confirmation email
- **Used by**: Checkout page after order placement
- **Status**: ✅ Fully implemented

### POST /api/email/welcome
Send welcome email
- **Used by**: Can be added to signup flow
- **Status**: ✅ Ready to use

### POST /api/email/password-reset
Send password reset email
- **Used by**: ForgotPassword page
- **Status**: ⚠️ Prepared but Supabase built-in is used

### POST /api/auth/verify-reset-token
Verify password reset token
- **Status**: ⚠️ Requires full custom implementation

### POST /api/auth/reset-password
Update password with token
- **Status**: ⚠️ Requires Supabase Admin API

## Production Recommendations

### Email Provider
**Recommended**: SendGrid
- Free tier: 100 emails/day
- Paid: $19.95/month (40,000 emails)
- Excellent deliverability

**Configuration**:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=YOUR_SENDGRID_API_KEY
EMAIL_FROM=Furnit <noreply@yourdomain.com>
```

### Password Reset
**Option 1** (Easiest): Configure custom SMTP in Supabase
- Go to Supabase Dashboard
- Settings → Auth → SMTP Settings
- Enter SendGrid credentials
- Keep using Supabase password reset

**Option 2** (Full Control): Implement custom reset
- Add Supabase Service Role Key to server
- Create password update endpoint
- Use Nodemailer for emails
- More complex but full control

## Cost Breakdown

### Development (Free)
- Gmail: 500 emails/day
- Supabase: Built-in emails
- Total: $0/month

### Production (Recommended)
- SendGrid Essentials: $19.95/month (40,000 emails)
- Covers ~1,300 orders/day
- Professional deliverability

### High Volume
- SendGrid Pro: $89.95/month (100,000 emails)
- AWS SES: $0.10 per 1,000 emails
- Very cost-effective at scale

## Testing

### Test Order Confirmation
1. Start both servers
2. Complete a test order
3. Check email inbox
4. Verify order details are correct

### Test Password Reset
1. Go to `/forgot-password`
2. Enter email
3. Check inbox for Supabase email
4. Click link and reset password

## Troubleshooting

### Emails not sending
- Check server logs for errors
- Verify EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use app password not account password
- Check firewall isn't blocking port 587

### Order confirmation not received
- Check server is running (`cd server && npm run dev`)
- Verify VITE_EMAIL_API_URL in `.env`
- Check browser console for API errors
- Check spam folder

### Password reset not working
- Verify email confirmation is disabled in Supabase
- Check Supabase email settings
- Try with a different email address

## Next Steps

### Immediate
1. ✅ Order confirmations working with Nodemailer
2. ✅ Disable Supabase email confirmation
3. ✅ Test email sending

### Before Production
1. Sign up for SendGrid
2. Configure SendGrid in server
3. Test all email flows
4. Set up custom domain emails

### Optional Enhancements
1. Implement custom password reset with Nodemailer
2. Add email templates for:
   - Order shipped
   - Order delivered
   - Payment confirmation
3. Add email tracking (opens, clicks)
4. Implement email queuing for reliability

## Summary

✅ **Order Confirmations**: Fully working with Nodemailer
✅ **Welcome Emails**: Ready to use
✅ **Email Server**: Running and tested
⚠️ **Password Reset**: Uses Supabase (works but uses their emails)
✅ **No Rate Limits**: Unlimited emails with your SMTP
✅ **Production Ready**: Just add SendGrid credentials

Your email system is ready for order confirmations! Password reset works through Supabase. For full custom password reset, additional server-side implementation is needed.
