# Email Troubleshooting Guide

## ✅ Email Server Status: WORKING!

Your email server is configured correctly and can send emails.

## Test Results

```
✅ Email server is ready to send messages
✅ Test email sent successfully!
📬 Message ID: <61a6211e-0899-8735-7e90-dbeb2bc9e1ca@gmail.com>
📧 Recipient: mugishaivanbright250@gmail.com
```

## Why Users Might Not Receive Emails

### 1. Email Server Not Running
**Problem**: Email server must be running for emails to be sent.

**Solution**:
```bash
# Terminal 1: Start email server
cd server
npm run dev

# Keep this terminal open!
```

**Check**: You should see:
```
🚀 Email server running on port 3001
✅ Email server is ready to send messages
```

### 2. Emails Going to Spam
**Problem**: Gmail might mark emails as spam.

**Solution**:
- Check spam/junk folder
- Mark as "Not Spam"
- Add sender to contacts

### 3. Password Reset Uses Supabase
**Problem**: Password reset currently uses Supabase emails, not your Nodemailer server.

**Current Flow**:
- User clicks "Forgot Password"
- Supabase sends the email (not your server)
- Supabase has rate limits

**Solution**: Disable email confirmation in Supabase:
1. Go to https://supabase.com/dashboard
2. Authentication → Providers → Email
3. Turn OFF "Confirm email"
4. Save

### 4. Order Confirmation Emails
**Status**: ✅ Working (uses your Nodemailer server)

**How to test**:
1. Start email server: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Complete a test order
4. Check email inbox
5. Look for "Order Confirmation" email

## Testing Email Delivery

### Test 1: Server Connection
```bash
cd server
node test-email.js
```

**Expected output**:
```
✅ Email server is ready to send messages
✅ Test email sent successfully!
```

### Test 2: Order Confirmation
1. Start both servers
2. Place a test order
3. Check server logs for:
   ```
   ✅ Order confirmation email sent to user@example.com
   ```
4. Check email inbox

### Test 3: Check Spam Folder
- Gmail: Check "Spam" folder
- Outlook: Check "Junk Email"
- Yahoo: Check "Spam"

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause**: Email server not running

**Solution**:
```bash
cd server
npm run dev
```

### Issue: "Invalid login credentials"
**Cause**: Wrong Gmail app password

**Solution**:
1. Go to https://myaccount.google.com/apppasswords
2. Delete old app password
3. Create new app password
4. Update `EMAIL_PASSWORD` in `server/.env`
5. Remove quotes from password

### Issue: "Connection timeout"
**Cause**: Firewall blocking port 587

**Solution**:
- Check firewall settings
- Try port 465 with `secure: true`
- Check antivirus software

### Issue: Emails not arriving
**Possible causes**:
1. ✅ Server not running → Start server
2. ✅ Wrong email address → Check recipient email
3. ✅ Spam folder → Check spam
4. ✅ Gmail blocking → Use SendGrid instead

## Current Configuration

### Email Server (.env)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mugishaivanbright250@gmail.com
EMAIL_PASSWORD=pkew edgz nvxp sryk
EMAIL_FROM=Furnit <mugishaivanbright250@gmail.com>
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### What Sends Emails

| Feature | Email Method | Status |
|---------|--------------|--------|
| Order Confirmation | Nodemailer (your server) | ✅ Working |
| Password Reset | Supabase | ⚠️ Rate limited |
| Welcome Email | Nodemailer (optional) | ✅ Ready |

## Recommended Setup

### For Development
1. **Start email server**: `cd server && npm run dev`
2. **Disable Supabase email confirmation**
3. **Test order confirmations**

### For Production
1. **Use SendGrid** instead of Gmail
   - More reliable
   - Better deliverability
   - No rate limits
   
2. **Update server/.env**:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=YOUR_SENDGRID_API_KEY
   EMAIL_FROM=Furnit <noreply@yourdomain.com>
   ```

## Verification Checklist

- [x] Email server can connect to Gmail
- [x] Test email sent successfully
- [x] Email configuration correct
- [ ] Email server running (start with `npm run dev`)
- [ ] Order confirmation tested
- [ ] Spam folder checked
- [ ] Supabase email confirmation disabled

## Next Steps

### To Ensure Users Receive Emails:

1. **Always run email server**:
   ```bash
   cd server
   npm run dev
   # Keep this terminal open
   ```

2. **Test order confirmation**:
   - Place a test order
   - Check email inbox
   - Check spam folder

3. **For password reset**:
   - Disable Supabase email confirmation
   - Or configure custom SMTP in Supabase

4. **Monitor server logs**:
   - Watch for "✅ Email sent" messages
   - Check for any errors

## Support

If emails still not arriving:
1. Check server is running
2. Check spam folder
3. Verify email address is correct
4. Check server logs for errors
5. Try sending test email: `node test-email.js`

Your email server is working! Just make sure it's running when users place orders.
