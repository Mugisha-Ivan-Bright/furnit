import dotenv from 'dotenv';
import { transporter, verifyEmailConnection } from './config/email.js';

dotenv.config();

async function testEmail() {
    console.log('Testing email configuration...\n');

    // Test connection
    const isConnected = await verifyEmailConnection();

    if (!isConnected) {
        console.error('❌ Email server connection failed!');
        console.log('\nTroubleshooting:');
        console.log('1. Check EMAIL_USER and EMAIL_PASSWORD in .env');
        console.log('2. Make sure you are using Gmail App Password (not account password)');
        console.log('3. Verify 2-Step Verification is enabled on your Google account');
        process.exit(1);
    }

    // Send test email
    console.log('\n📧 Sending test email...');

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email from Furnit',
            html: `
                <h1>Email Server Test</h1>
                <p>If you're reading this, your email server is working correctly!</p>
                <p><strong>Configuration:</strong></p>
                <ul>
                    <li>Host: ${process.env.EMAIL_HOST}</li>
                    <li>Port: ${process.env.EMAIL_PORT}</li>
                    <li>User: ${process.env.EMAIL_USER}</li>
                </ul>
                <p>✅ Email server is ready to send order confirmations!</p>
            `,
            text: 'If you\'re reading this, your email server is working correctly!'
        });

        console.log('✅ Test email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📧 Check your inbox:', process.env.EMAIL_USER);
        console.log('\n✨ Email server is ready to use!');

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        console.log('\nError details:', error);
    }
}

testEmail();
