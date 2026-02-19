import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { transporter, verifyEmailConnection, emailTemplates } from './config/email.js';
import { createPasswordResetToken, hashToken } from './utils/tokenGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase Admin Client (to check if user exists)
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

// In-memory store for reset tokens (use Redis in production)
const resetTokens = new Map();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Verify email connection on startup
verifyEmailConnection();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Email server is running' });
});

// Send order confirmation email
app.post('/api/email/order-confirmation', async (req, res) => {
    try {
        const orderData = req.body;

        // Validate required fields
        if (!orderData.customerEmail || !orderData.orderId) {
            return res.status(400).json({
                error: 'Missing required fields: customerEmail, orderId'
            });
        }

        const emailContent = emailTemplates.orderConfirmation(orderData);

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: orderData.customerEmail,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        console.log(`✅ Order confirmation email sent to ${orderData.customerEmail}`);
        res.json({
            success: true,
            message: 'Order confirmation email sent successfully'
        });
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Send password reset email
app.post('/api/email/password-reset', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Missing required field: email'
            });
        }

        // Check if user exists in Supabase using Admin API
        const { data: { users }, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();

        if (fetchError) {
            console.error('❌ Error fetching users from Supabase:', fetchError);
            // For security, still return success message
            return res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // Find user by email
        const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log(`⚠️ Password reset requested for non-existent email: ${email}`);
            console.log(`🚫 NOT sending email - user does not exist`);
            // Return error to inform user that email doesn't exist
            return res.status(404).json({
                success: false,
                error: 'No account found with this email address. Please check your email or sign up.'
            });
        }

        console.log(`✅ User found: ${user.email} - Proceeding to send reset email`);

        // User exists! Generate reset token and send email via Nodemailer
        const { token, hashedToken, expiresAt } = createPasswordResetToken();

        // Store token with user info
        resetTokens.set(hashedToken, {
            email: user.email.toLowerCase(),
            userId: user.id,
            expiresAt: expiresAt.getTime()
        });

        // Create reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        // Send email via Nodemailer (NOT Supabase)
        const emailContent = emailTemplates.passwordReset({ email: user.email, resetLink });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        console.log(`✅ Password reset email sent to ${user.email} via Nodemailer`);
        res.json({
            success: true,
            message: 'Password reset email sent successfully'
        });
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Verify reset token
app.post('/api/auth/verify-reset-token', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Missing required field: token'
            });
        }

        // Hash the token to look it up
        const hashedToken = hashToken(token);
        const tokenData = resetTokens.get(hashedToken);

        if (!tokenData) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        // Check if token is expired
        if (Date.now() > tokenData.expiresAt) {
            resetTokens.delete(hashedToken);
            return res.status(400).json({
                error: 'Reset token has expired'
            });
        }

        res.json({
            success: true,
            email: tokenData.email
        });
    } catch (error) {
        console.error('❌ Error verifying reset token:', error);
        res.status(500).json({
            error: 'Failed to verify token',
            details: error.message
        });
    }
});

// Reset password with token
// NOTE: This only verifies the token. The actual password update happens in Supabase on the frontend
// because we don't have access to Supabase Admin API here (and we don't want to)
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                error: 'Missing required fields: token, newPassword'
            });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Hash the token to look it up
        const hashedToken = hashToken(token);
        const tokenData = resetTokens.get(hashedToken);

        if (!tokenData) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        // Check if token is expired
        if (Date.now() > tokenData.expiresAt) {
            resetTokens.delete(hashedToken);
            return res.status(400).json({
                error: 'Reset token has expired'
            });
        }

        // Delete the token (one-time use)
        resetTokens.delete(hashedToken);

        console.log(`✅ Password reset token verified for ${tokenData.email}`);

        res.json({
            success: true,
            email: tokenData.email,
            message: 'Token verified. Password can be updated.'
        });
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        res.status(500).json({
            error: 'Failed to reset password',
            details: error.message
        });
    }
});

// Send welcome email
app.post('/api/email/welcome', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({
                error: 'Missing required fields: email, name'
            });
        }

        const emailContent = emailTemplates.welcomeEmail({ email, name });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        console.log(`✅ Welcome email sent to ${email}`);
        res.json({
            success: true,
            message: 'Welcome email sent successfully'
        });
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Send password changed confirmation email
app.post('/api/email/password-changed', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({
                error: 'Missing required fields: email, name'
            });
        }

        const emailContent = emailTemplates.passwordChanged({ email, name });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        console.log(`✅ Password changed confirmation email sent to ${email}`);
        res.json({
            success: true,
            message: 'Password changed confirmation email sent successfully'
        });
    } catch (error) {
        console.error('❌ Error sending password changed email:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Email server running on port ${PORT}`);
    console.log(`📧 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📬 Email from: ${process.env.EMAIL_FROM}`);
});
