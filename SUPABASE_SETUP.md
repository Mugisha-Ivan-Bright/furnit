# Supabase Authentication Setup Guide

## Overview
Your Furnit e-commerce app now uses Supabase for authentication with support for:
- Email/Password authentication
- Google OAuth sign-in
- Session management
- Protected routes

## Setup Instructions

### 1. Supabase Project Configuration

Your `.env` file already contains Supabase credentials:
```
VITE_SUPABASE_URL=https://gdoncogzvnmkvyxhbjjv.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_iBSrKN36S0Xe1OJ1yQmmjw_gH0GjTyE
```

### 2. Disable Email Confirmation (Recommended for Development)

**IMPORTANT**: To avoid Supabase email rate limits during development:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. **Turn OFF** "Confirm email" toggle
4. Click "Save"

**Benefits**:
- ✅ No email rate limit issues
- ✅ Users can login immediately after signup
- ✅ Faster development and testing
- ✅ No email verification required

**For Production**: Set up custom SMTP (see `DISABLE_EMAIL_CONFIRMATION.md`)

### 3. Enable Authentication Providers

Go to your Supabase Dashboard:
1. Navigate to **Authentication** → **Providers**
2. **Email** provider should be enabled by default (with confirmation OFF as per step 2)
3. Enable **Google** provider (optional):
   - Click on Google provider
   - Toggle "Enable Sign in with Google"
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Add authorized redirect URL: `https://gdoncogzvnmkvyxhbjjv.supabase.co/auth/v1/callback`

### 4. Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your app URL (e.g., `http://localhost:5173` for development)
3. Add **Redirect URLs**:
   - `http://localhost:5173/dashboard`
   - Add your production URL when deploying

### 5. Google OAuth Setup (Optional)

To enable Google sign-in:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://gdoncogzvnmkvyxhbjjv.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase Google provider settings

## Features Implemented

### Authentication Context (`src/context/AuthContext.jsx`)
- `signUp(email, password, fullName)` - Create new account
- `signIn(email, password)` - Sign in with email/password
- `signInWithGoogle()` - Sign in with Google OAuth
- `signOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword)` - Update user password
- `user` - Current user object
- `isAuthenticated` - Boolean authentication status
- `loading` - Loading state during auth check

### Login Page (`src/pages/Login.jsx`)
- Email/password sign-in form
- Google OAuth button
- Error handling with user-friendly messages
- Redirect to dashboard after successful login
- Shows alert if redirected from protected action (e.g., adding to cart)
- Link to forgot password page
- Original split-screen design preserved

### Signup Page (`src/pages/Signup.jsx`)
- Email/password registration form
- Full name field
- Google OAuth button
- Email verification message after signup
- Success/error notifications
- Original split-screen design preserved

### Forgot Password Page (`src/pages/ForgotPassword.jsx`)
- Email input form to request password reset
- Sends reset link to user's email
- Success confirmation with instructions
- Step-by-step guide on left side
- Retry option if email not received
- Split-screen design matching auth pages

### Reset Password Page (`src/pages/ResetPassword.jsx`)
- New password and confirm password fields
- Password visibility toggle (eye icon)
- Password strength requirements display
- Validation for matching passwords
- Success confirmation after reset
- Automatic redirect to login page
- Email notification sent after successful reset
- Split-screen design matching auth pages

### Protected Cart Actions (`src/App.jsx`)
- Unauthenticated users are redirected to login when trying to add items to cart
- Alert message displayed: "Please login to add items to your cart"
- After login, users are redirected back to the page they came from

## Testing Authentication

### Test Email/Password Sign Up:
1. Go to `/signup`
2. Fill in name, email, and password (min 6 characters)
3. Click "Create Account"
4. Check your email for verification link (if email confirmation is enabled)
5. You'll be redirected to login page with success message

### Test Email/Password Sign In:
1. Go to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to dashboard

### Test Google Sign In:
1. Go to `/login` or `/signup`
2. Click "Continue with Google" or "Sign up with Google"
3. Complete Google OAuth flow
4. You'll be redirected to dashboard

### Test Password Recovery:
1. Go to `/login`
2. Click "Forgot Password?" link
3. Enter your email address
4. Click "Send Reset Link"
5. Check your email for password reset link
6. Click the link in email (opens `/reset-password`)
7. Enter new password and confirm password
8. Click "Reset Password"
9. You'll see success message and be redirected to login
10. Check your email for password change confirmation
11. Sign in with your new password

### Test Protected Cart:
1. Sign out (if signed in)
2. Try to add a product to cart from home page or products page
3. You'll be redirected to login with an alert message
4. After signing in, you'll be redirected back to the page you were on

## User Flow

1. **New User**:
   - Visits site → Tries to add to cart → Redirected to login
   - Clicks "Create one" → Goes to signup
   - Signs up with email/password or Google
   - Receives verification email (if enabled)
   - Logs in → Redirected to dashboard

2. **Returning User**:
   - Visits site → Clicks login
   - Signs in with email/password or Google
   - Redirected to dashboard
   - Can now add items to cart

3. **Forgot Password**:
   - Goes to login → Clicks "Forgot Password?"
   - Enters email → Receives reset link
   - Clicks link in email → Redirected to reset password page
   - Enters new password → Receives confirmation email
   - Redirected to login → Signs in with new password

## Troubleshooting

### "Invalid login credentials" error:
- Check if email is verified (if email confirmation is enabled in Supabase)
- Verify password is correct
- Check Supabase dashboard for user status

### Google sign-in not working:
- Verify Google provider is enabled in Supabase
- Check OAuth credentials are correct
- Ensure redirect URLs are properly configured

### Users not persisting after refresh:
- Check browser console for errors
- Verify Supabase URL and key in `.env`
- Clear browser cache and cookies

### Password reset email not received:
- Check spam/junk folder
- Verify email provider settings in Supabase
- Check Supabase logs for email delivery status
- Ensure SMTP is configured correctly in Supabase

### Reset password link expired:
- Request a new reset link (links expire after 1 hour)
- Check system time is correct

## Next Steps

1. **Email Templates**: Customize email templates in Supabase Dashboard → Authentication → Email Templates
   - Customize "Reset Password" email template
   - Customize "Password Changed" confirmation email
   - Add your branding and styling
2. **User Profiles**: Create a `profiles` table to store additional user data
3. **Social Providers**: Add more OAuth providers (Facebook, GitHub, etc.)
4. **Role-Based Access**: Implement user roles and permissions
5. **Two-Factor Authentication**: Add 2FA for enhanced security

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) on Supabase tables
- Implement rate limiting for authentication endpoints
- Use HTTPS in production
