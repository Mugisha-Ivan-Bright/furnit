# Email Server Setup with Nodemailer

## Overview
Custom email server using Node.js, Express, and Nodemailer to send order confirmations and other transactional emails without Supabase email limits.

## Architecture

```
Frontend (React) → Email API (Express) → SMTP Server (Gmail/SendGrid) → User's Inbox
```

## Setup Instructions

### Step 1: Install Server Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Email Credentials

Create `server/.env` file:

```env
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Furnit <noreply@furnit.com>

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 3: Get Gmail App Password

#### For Gmail Users:

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Furnit Email Server"
   - Click "Generate"
   - Copy the 16-character password
   - Paste it in `EMAIL_PASSWORD` in `.env`

3. **Update .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your app password
   EMAIL_FROM=Furnit <youremail@gmail.com>
   ```

### Step 4: Start Email Server

```bash
# Development (with auto-reload)
cd server
npm run dev

# Production
cd server
npm start
```

You should see:
```
🚀 Email server running on port 3001
✅ Email server is ready to send messages
📧 Frontend URL: http://localhost:5173
📬 Email from: Furnit <youremail@gmail.com>
```

### Step 5: Update Frontend Environment

Add to your main `.env` file (in root directory):

```env
VITE_EMAIL_API_URL=http://localhost:3001/api/email
```

### Step 6: Test Email Sending

1. Start both servers:
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Email Server
   cd server
   npm run dev
   ```

2. Place a test order
3. Check your email inbox for order confirmation

## Email Templates

### 1. Order Confirmation
**Sent when**: User completes checkout
**Contains**:
- Order number and date
- Customer details
- Delivery information
- Order items with prices
- Payment method
- Total amount
- Link to track order

### 2. Password Reset
**Sent when**: User requests password reset
**Contains**:
- Reset link (expires in 1 hour)
- Security warning
- Plain text link as backup

### 3. Welcome Email
**Sent when**: User signs up
**Contains**:
- Welcome message
- Key benefits (free shipping, returns, etc.)
- Link to start shopping

## API Endpoints

### POST /api/email/order-confirmation
Send order confirmation email

**Request Body**:
```json
{
  "orderId": "uuid",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "deliveryAddress": "123 Main St",
  "deliveryCity": "Kigali",
  "deliveryDistrict": "Gasabo",
  "deliverySector": "Remera",
  "deliveryDate": "2024-02-15",
  "deliveryTime": "morning",
  "paymentMethod": "momo",
  "items": [
    {
      "name": "Scandi Lounge Chair",
      "quantity": 1,
      "price": 890
    }
  ],
  "subtotal": 890,
  "deliveryFee": 0,
  "total": 890,
  "orderNotes": "Please call before delivery",
  "createdAt": "2024-02-10T10:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order confirmation email sent successfully"
}
```

### POST /api/email/password-reset
Send password reset email

**Request Body**:
```json
{
  "email": "user@example.com",
  "resetLink": "https://furnit.com/reset-password?token=..."
}
```

### POST /api/email/welcome
Send welcome email

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## SMTP Provider Options

### Option 1: Gmail (Free, Easy Setup)
- **Limit**: 500 emails/day
- **Cost**: Free
- **Setup**: 5 minutes
- **Best for**: Development & small projects

**Pros**:
- ✅ Free
- ✅ Easy setup
- ✅ Reliable

**Cons**:
- ❌ 500 emails/day limit
- ❌ May be flagged as spam
- ❌ Not ideal for production

### Option 2: SendGrid (Recommended for Production)
- **Limit**: 100 emails/day (free), 40,000/month (paid)
- **Cost**: Free tier, then $19.95/month
- **Setup**: 15 minutes
- **Best for**: Production

**Configuration**:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=YOUR_SENDGRID_API_KEY
EMAIL_FROM=Furnit <noreply@yourdomain.com>
```

### Option 3: Mailgun
- **Limit**: 5,000 emails/month (free trial)
- **Cost**: $35/month (50,000 emails)
- **Setup**: 15 minutes

**Configuration**:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASSWORD=YOUR_MAILGUN_PASSWORD
EMAIL_FROM=Furnit <noreply@yourdomain.com>
```

### Option 4: AWS SES
- **Limit**: 62,000 emails/month (free on AWS)
- **Cost**: $0.10 per 1,000 emails
- **Setup**: 30 minutes (more complex)

**Configuration**:
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=YOUR_AWS_ACCESS_KEY
EMAIL_PASSWORD=YOUR_AWS_SECRET_KEY
EMAIL_FROM=Furnit <noreply@yourdomain.com>
```

## Frontend Integration

The frontend automatically calls the email API after successful order placement:

```javascript
// In Checkout.jsx
import { sendOrderConfirmationEmail } from '../utils/emailService';

// After order is saved to database
sendOrderConfirmationEmail(orderData).catch(err => {
    console.error('Failed to send email:', err);
    // Email failure doesn't break the order flow
});
```

## Error Handling

### Email Failures Don't Break Orders
- Order is saved to database first
- Email is sent asynchronously
- If email fails, order still succeeds
- Error is logged but not shown to user

### Retry Logic (Optional)
You can add retry logic in the email service:

```javascript
const sendWithRetry = async (emailFunction, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await emailFunction();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};
```

## Testing

### Test Email Sending

```bash
# Test with curl
curl -X POST http://localhost:3001/api/email/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test-123",
    "customerName": "Test User",
    "customerEmail": "your-email@gmail.com",
    "deliveryAddress": "123 Test St",
    "deliveryCity": "Kigali",
    "deliveryDistrict": "Gasabo",
    "deliverySector": "Remera",
    "deliveryDate": "2024-02-15",
    "deliveryTime": "morning",
    "paymentMethod": "momo",
    "items": [{"name": "Test Product", "quantity": 1, "price": 100}],
    "subtotal": 100,
    "deliveryFee": 0,
    "total": 100,
    "createdAt": "2024-02-10T10:00:00Z"
  }'
```

### Check Server Logs

```bash
cd server
npm run dev

# You should see:
✅ Order confirmation email sent to your-email@gmail.com
```

## Deployment

### Deploy Email Server

#### Option 1: Same Server as Frontend
- Deploy both frontend and backend together
- Use process manager (PM2)

#### Option 2: Separate Server
- Deploy email server separately
- Update `VITE_EMAIL_API_URL` to production URL

#### Option 3: Serverless (AWS Lambda, Vercel Functions)
- Convert Express app to serverless function
- Deploy to AWS Lambda or Vercel

### Environment Variables in Production

```env
# Production .env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=YOUR_PRODUCTION_API_KEY
EMAIL_FROM=Furnit <noreply@furnit.com>
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://furnit.com
```

## Security Best Practices

1. **Never commit .env files**
   - Add `server/.env` to `.gitignore`
   - Use environment variables in production

2. **Use App Passwords**
   - Never use your actual Gmail password
   - Use app-specific passwords

3. **Rate Limiting**
   - Add rate limiting to prevent abuse
   - Use `express-rate-limit` package

4. **CORS Configuration**
   - Only allow your frontend domain
   - Update in production

5. **Input Validation**
   - Validate all email inputs
   - Sanitize user data

## Troubleshooting

### Issue: "Invalid login credentials"
**Solution**: 
- Check EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use app password, not account password
- Verify 2FA is enabled

### Issue: "Connection timeout"
**Solution**:
- Check EMAIL_HOST and EMAIL_PORT
- Verify firewall isn't blocking port 587
- Try port 465 with `secure: true`

### Issue: Emails going to spam
**Solution**:
- Use a custom domain
- Set up SPF and DKIM records
- Use a reputable SMTP provider (SendGrid)
- Avoid spam trigger words

### Issue: "Email rate limit exceeded"
**Solution**:
- Switch from Gmail to SendGrid/Mailgun
- Upgrade to paid plan
- Implement email queuing

## Monitoring

### Log Email Sends
```javascript
console.log(`✅ Email sent to ${email}`);
console.error(`❌ Email failed: ${error.message}`);
```

### Track Email Metrics
- Delivery rate
- Open rate (with tracking pixels)
- Click rate (with tracked links)
- Bounce rate

### Use Email Service Dashboard
- SendGrid: Analytics dashboard
- Mailgun: Logs and analytics
- AWS SES: CloudWatch metrics

## Cost Estimation

### Development (Gmail):
- **Cost**: $0/month
- **Limit**: 500 emails/day
- **Sufficient for**: Testing & development

### Small Business (SendGrid Free):
- **Cost**: $0/month
- **Limit**: 100 emails/day
- **Sufficient for**: 3,000 orders/month

### Growing Business (SendGrid Essentials):
- **Cost**: $19.95/month
- **Limit**: 40,000 emails/month
- **Sufficient for**: 1,300 orders/day

### Large Business (SendGrid Pro):
- **Cost**: $89.95/month
- **Limit**: 100,000 emails/month
- **Sufficient for**: 3,300 orders/day

## Summary

✅ **Setup Time**: 15-30 minutes
✅ **Cost**: Free for development, $20-90/month for production
✅ **Reliability**: High (99.9% uptime with SendGrid)
✅ **Scalability**: Handles thousands of emails/day
✅ **No Supabase Limits**: Unlimited emails
✅ **Professional**: Custom templates and branding

Your email server is now ready to send order confirmations, password resets, and welcome emails without any Supabase rate limits!
