# Password Recovery Flow Documentation

## Overview
Complete password recovery system with email verification, password reset, and confirmation emails.

## User Journey

### Step 1: Forgot Password Request
**Page**: `/forgot-password`

1. User clicks "Forgot Password?" link on login page
2. Redirected to forgot password page with split-screen design
3. User enters their email address
4. Clicks "Send Reset Link" button
5. System sends password reset email via Supabase
6. Success message displayed: "Check Your Email"
7. Instructions shown to check inbox and spam folder

**Features**:
- Clean, minimal form with email input only
- Left side shows 3-step process guide
- Error handling for invalid emails
- Retry option if email not received
- Link back to login page

### Step 2: Email Received
**Email**: Password Reset Email (sent by Supabase)

The user receives an email containing:
- Subject: "Reset Your Password"
- Personalized greeting
- Reset password link (valid for 1 hour)
- Security notice
- Link format: `https://your-app.com/reset-password?token=...`

**Email Configuration**:
- Configured in Supabase Dashboard → Authentication → Email Templates
- Template: "Reset Password"
- Redirect URL: `${window.location.origin}/reset-password`

### Step 3: Reset Password
**Page**: `/reset-password`

1. User clicks link in email
2. Redirected to reset password page
3. Supabase automatically validates the token
4. User enters new password (min 6 characters)
5. User confirms new password
6. Password visibility toggle available (eye icon)
7. Validation checks:
   - Password length (min 6 characters)
   - Passwords match
8. Clicks "Reset Password" button
9. System updates password in Supabase
10. Success message displayed
11. Automatic redirect to login page after 3 seconds

**Features**:
- Two password fields (new password + confirm)
- Show/hide password toggle on both fields
- Real-time validation
- Password requirements displayed
- Left side shows security tips
- Success confirmation with auto-redirect

### Step 4: Confirmation Email
**Email**: Password Changed Confirmation (sent by Supabase)

After successful password reset, user receives:
- Subject: "Your Password Has Been Changed"
- Confirmation that password was updated
- Timestamp of change
- Security notice to contact support if not authorized
- Link to login page

**Email Configuration**:
- Configured in Supabase Dashboard → Authentication → Email Templates
- Template: "Change Email" (can be customized)

### Step 5: Login with New Password
**Page**: `/login`

1. User is redirected to login page
2. User enters email and new password
3. Clicks "Sign In"
4. Successfully authenticated
5. Redirected to dashboard

## Technical Implementation

### Routes Added
```javascript
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

### AuthContext Methods

#### `resetPassword(email)`
```javascript
const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
};
```

#### `updatePassword(newPassword)`
```javascript
const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    if (error) throw error;
    return data;
};
```

### Component Structure

#### ForgotPassword.jsx
- Split-screen layout (image left, form right)
- Email input form
- Success state with instructions
- Error handling
- Retry functionality

#### ResetPassword.jsx
- Split-screen layout (image left, form right)
- New password input
- Confirm password input
- Password visibility toggles
- Validation logic
- Success state with auto-redirect

## Design Consistency

All password recovery pages follow the same design pattern:

### Layout
- Split-screen design (50/50 on desktop)
- Left side: Image with gradient overlay and informational content
- Right side: Form with white/background color
- Responsive: Full-width form on mobile, image hidden

### Visual Elements
- Large circular icon at top (Mail/Lock)
- Serif font for headings (4xl)
- Rounded corners (2xl) on all inputs and buttons
- Accent color for primary actions
- Soft background colors for inputs
- Animated transitions with Framer Motion

### Color Scheme
- Success: Green (green-50, green-100, green-600)
- Error: Red (red-50, red-200, red-600)
- Info: Orange (orange-50, orange-200, orange-600)
- Primary: Dark/Accent from theme

### Typography
- Headings: Font-serif, bold, 4xl
- Body: Sans-serif, regular
- Labels: Uppercase, tracking-widest, 10px
- Links: Bold, accent color

## Security Features

1. **Token Expiration**: Reset links expire after 1 hour
2. **One-Time Use**: Reset tokens can only be used once
3. **Email Verification**: Only registered emails can request reset
4. **Password Requirements**: Minimum 6 characters enforced
5. **Confirmation Emails**: User notified of password changes
6. **Secure Redirect**: Uses window.location.origin for redirect URL

## Supabase Configuration

### Required Settings

1. **Site URL**: Set in Authentication → URL Configuration
   - Development: `http://localhost:5173`
   - Production: Your production URL

2. **Redirect URLs**: Add to allowed list
   - `http://localhost:5173/reset-password`
   - `https://your-domain.com/reset-password`

3. **Email Templates**: Customize in Authentication → Email Templates
   - **Reset Password Template**:
     - Subject: Reset Your Password
     - Body: Include {{ .ConfirmationURL }} token
     - Customize branding and styling
   
   - **Password Changed Template**:
     - Subject: Your Password Has Been Changed
     - Body: Confirmation message
     - Include timestamp and security notice

### Email Template Variables
- `{{ .Email }}` - User's email
- `{{ .ConfirmationURL }}` - Reset password link
- `{{ .Token }}` - Reset token
- `{{ .SiteURL }}` - Your site URL

## Testing Checklist

- [ ] User can request password reset from login page
- [ ] Email is sent with reset link
- [ ] Reset link opens reset password page
- [ ] Invalid/expired tokens show error
- [ ] Password validation works (min 6 chars)
- [ ] Passwords must match validation
- [ ] Password visibility toggle works
- [ ] Success message displays after reset
- [ ] Confirmation email is sent
- [ ] User can login with new password
- [ ] Old password no longer works
- [ ] Retry option works on forgot password page
- [ ] Back to login links work
- [ ] Mobile responsive design works
- [ ] Animations are smooth

## Error Handling

### Common Errors

1. **"User not found"**
   - Email not registered in system
   - Show generic message for security

2. **"Invalid or expired token"**
   - Reset link expired (>1 hour)
   - Token already used
   - Redirect to forgot password page

3. **"Password too short"**
   - Less than 6 characters
   - Show validation error

4. **"Passwords do not match"**
   - Confirm password doesn't match
   - Show validation error

5. **"Failed to send email"**
   - SMTP configuration issue
   - Check Supabase email settings

## Best Practices

1. **Security**
   - Never expose whether email exists in system
   - Use generic success messages
   - Implement rate limiting on reset requests
   - Log all password reset attempts

2. **User Experience**
   - Clear instructions at each step
   - Visual feedback for all actions
   - Loading states during API calls
   - Success confirmations
   - Easy retry options

3. **Email Delivery**
   - Use professional email service
   - Configure SPF/DKIM records
   - Test email delivery regularly
   - Monitor bounce rates

4. **Accessibility**
   - Proper form labels
   - Error messages announced
   - Keyboard navigation support
   - High contrast colors

## Future Enhancements

1. **Rate Limiting**: Limit reset requests per email/IP
2. **Two-Factor Authentication**: Add 2FA before password reset
3. **Password Strength Meter**: Visual indicator of password strength
4. **Password History**: Prevent reusing recent passwords
5. **Security Questions**: Additional verification step
6. **SMS Verification**: Alternative to email verification
7. **Account Recovery**: Multiple recovery options
8. **Audit Log**: Track all password changes

## Support

If users experience issues:
1. Check spam/junk folder for emails
2. Verify email address is correct
3. Request new reset link if expired
4. Contact support if persistent issues
5. Check Supabase dashboard for error logs
