import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify connection configuration
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email server connection failed:', error);
        return false;
    }
};

// Email templates
export const emailTemplates = {
    orderConfirmation: (orderData) => ({
        subject: `Order Confirmation - #${orderData.orderId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-size: 20px; font-weight: bold; color: #D4A574; margin-top: 20px; }
                    .button { display: inline-block; background: #D4A574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>furnit.</h1>
                        <p>Thank you for your order!</p>
                    </div>
                    <div class="content">
                        <h2>Order Confirmation</h2>
                        <p>Hi ${orderData.customerName},</p>
                        <p>We've received your order and it's being processed. Here are the details:</p>
                        
                        <div class="order-details">
                            <h3>Order #${orderData.orderId}</h3>
                            <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
                            <p><strong>Delivery Address:</strong><br>
                            ${orderData.deliveryAddress}<br>
                            ${orderData.deliverySector}, ${orderData.deliveryDistrict}, ${orderData.deliveryCity}</p>
                            <p><strong>Delivery Date:</strong> ${new Date(orderData.deliveryDate).toLocaleDateString()}</p>
                            <p><strong>Delivery Time:</strong> ${orderData.deliveryTime}</p>
                            
                            <h4>Items:</h4>
                            ${orderData.items.map(item => `
                                <div class="item">
                                    <span>${item.name} x ${item.quantity}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                            
                            <div class="item">
                                <span>Subtotal</span>
                                <span>$${orderData.subtotal.toFixed(2)}</span>
                            </div>
                            <div class="item">
                                <span>Delivery Fee</span>
                                <span>${orderData.deliveryFee === 0 ? 'FREE' : '$' + orderData.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div class="total">
                                <div class="item" style="border: none;">
                                    <span>Total</span>
                                    <span>$${orderData.total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'momo' ? 'Mobile Money' : 'Bank Transfer'}</p>
                            ${orderData.orderNotes ? `<p><strong>Notes:</strong> ${orderData.orderNotes}</p>` : ''}
                        </div>
                        
                        <p>We'll send you another email when your order ships.</p>
                        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Order Status</a>
                    </div>
                    <div class="footer">
                        <p>Questions? Contact us at support@furnit.com</p>
                        <p>&copy; ${new Date().getFullYear()} Furnit. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Order Confirmation - #${orderData.orderId}

Hi ${orderData.customerName},

We've received your order and it's being processed.

Order Details:
- Order Number: ${orderData.orderId}
- Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}
- Delivery Address: ${orderData.deliveryAddress}, ${orderData.deliverySector}, ${orderData.deliveryDistrict}
- Delivery Date: ${new Date(orderData.deliveryDate).toLocaleDateString()}

Items:
${orderData.items.map(item => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${orderData.subtotal.toFixed(2)}
Delivery: ${orderData.deliveryFee === 0 ? 'FREE' : '$' + orderData.deliveryFee.toFixed(2)}
Total: $${orderData.total.toFixed(2)}

Payment Method: ${orderData.paymentMethod === 'momo' ? 'Mobile Money' : 'Bank Transfer'}

Track your order: ${process.env.FRONTEND_URL}/dashboard

Questions? Contact us at support@furnit.com

© ${new Date().getFullYear()} Furnit. All rights reserved.
        `
    }),

    passwordReset: (resetData) => ({
        subject: 'Reset Your Password - Furnit',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #D4A574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>furnit.</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>Hi ${resetData.email},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <a href="${resetData.resetLink}" class="button">Reset Password</a>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong>
                            <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
                        </div>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${resetData.resetLink}</p>
                    </div>
                    <div class="footer">
                        <p>Questions? Contact us at support@furnit.com</p>
                        <p>&copy; ${new Date().getFullYear()} Furnit. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Reset Your Password - Furnit

Hi ${resetData.email},

We received a request to reset your password. Click the link below to create a new password:

${resetData.resetLink}

This link will expire in 1 hour. If you didn't request this, please ignore this email.

Questions? Contact us at support@furnit.com

© ${new Date().getFullYear()} Furnit. All rights reserved.
        `
    }),

    welcomeEmail: (userData) => ({
        subject: 'Welcome to Furnit!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .button { display: inline-block; background: #D4A574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .features { display: grid; gap: 15px; margin: 20px 0; }
                    .feature { background: white; padding: 15px; border-radius: 8px; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>furnit.</h1>
                        <p>Welcome to Premium Furniture</p>
                    </div>
                    <div class="content">
                        <h2>Welcome, ${userData.name}!</h2>
                        <p>Thank you for joining Furnit. We're excited to help you create the perfect living space.</p>
                        
                        <div class="features">
                            <div class="feature">
                                <strong>🚚 Free Shipping</strong>
                                <p>On all orders over $1000</p>
                            </div>
                            <div class="feature">
                                <strong>🔄 Easy Returns</strong>
                                <p>30-day hassle-free returns</p>
                            </div>
                            <div class="feature">
                                <strong>💎 Premium Quality</strong>
                                <p>Curated collection of finest furniture</p>
                            </div>
                        </div>
                        
                        <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping</a>
                    </div>
                    <div class="footer">
                        <p>Questions? Contact us at support@furnit.com</p>
                        <p>&copy; ${new Date().getFullYear()} Furnit. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Welcome to Furnit!

Hi ${userData.name},

Thank you for joining Furnit. We're excited to help you create the perfect living space.

Benefits:
- Free Shipping on orders over $1000
- 30-day hassle-free returns
- Premium quality furniture

Start shopping: ${process.env.FRONTEND_URL}/products

Questions? Contact us at support@furnit.com

© ${new Date().getFullYear()} Furnit. All rights reserved.
        `
    }),

    passwordChanged: (userData) => ({
        subject: 'Password Changed Successfully - Furnit',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #2C2C2C; color: white; padding: 30px; text-align: center; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .button { display: inline-block; background: #D4A574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>furnit.</h1>
                        <p>Password Changed</p>
                    </div>
                    <div class="content">
                        <h2>Password Successfully Changed</h2>
                        <p>Hi ${userData.name},</p>
                        <div class="success-box">
                            <strong>✅ Your password has been changed successfully!</strong>
                            <p style="margin: 10px 0 0 0;">Your account is now secured with your new password.</p>
                        </div>
                        <p>You can now sign in to your account using your new password.</p>
                        <a href="${process.env.FRONTEND_URL}/login" class="button">Sign In Now</a>
                        <div class="warning">
                            <strong>⚠️ Didn't make this change?</strong>
                            <p style="margin: 10px 0 0 0;">If you didn't request this password change, please contact our support team immediately at support@furnit.com</p>
                        </div>
                        <p><strong>Security Tips:</strong></p>
                        <ul>
                            <li>Never share your password with anyone</li>
                            <li>Use a unique password for your Furnit account</li>
                            <li>Enable two-factor authentication if available</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Questions? Contact us at support@furnit.com</p>
                        <p>&copy; ${new Date().getFullYear()} Furnit. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
Password Changed Successfully - Furnit

Hi ${userData.name},

Your password has been changed successfully!

Your account is now secured with your new password. You can now sign in using your new password.

Sign in: ${process.env.FRONTEND_URL}/login

⚠️ Didn't make this change?
If you didn't request this password change, please contact our support team immediately at support@furnit.com

Security Tips:
- Never share your password with anyone
- Use a unique password for your Furnit account
- Enable two-factor authentication if available

Questions? Contact us at support@furnit.com

© ${new Date().getFullYear()} Furnit. All rights reserved.
        `
    })
};
