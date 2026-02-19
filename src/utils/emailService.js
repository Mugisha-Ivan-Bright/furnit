// Email service to communicate with backend email server

const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/email';

export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const response = await fetch(`${EMAIL_API_URL}/order-confirmation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderData.id,
                customerName: orderData.customer_name,
                customerEmail: orderData.customer_email,
                deliveryAddress: orderData.delivery_address,
                deliveryCity: orderData.delivery_city,
                deliveryDistrict: orderData.delivery_district,
                deliverySector: orderData.delivery_sector,
                deliveryDate: orderData.delivery_date,
                deliveryTime: orderData.delivery_time,
                paymentMethod: orderData.payment_method,
                items: orderData.items,
                subtotal: orderData.subtotal,
                deliveryFee: orderData.delivery_fee,
                total: orderData.total,
                orderNotes: orderData.order_notes,
                createdAt: orderData.created_at
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        return data;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        // Don't throw error - email failure shouldn't break the order flow
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (email) => {
    try {
        const response = await fetch(`${EMAIL_API_URL}/password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            // Return the error from server
            return { success: false, error: data.error || 'Failed to send email' };
        }

        return data;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message || 'Failed to send email' };
    }
};

export const verifyResetToken = async (token) => {
    try {
        const response = await fetch(`${EMAIL_API_URL.replace('/email', '/auth')}/verify-reset-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Invalid or expired token');
        }

        return data;
    } catch (error) {
        console.error('Error verifying reset token:', error);
        throw error;
    }
};

export const resetPasswordWithToken = async (token, newPassword) => {
    try {
        const response = await fetch(`${EMAIL_API_URL.replace('/email', '/auth')}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to reset password');
        }

        return data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const sendPasswordChangedEmail = async (email, name) => {
    try {
        const response = await fetch(`${EMAIL_API_URL}/password-changed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        return data;
    } catch (error) {
        console.error('Error sending password changed email:', error);
        // Don't throw - email failure shouldn't break the flow
        return { success: false, error: error.message };
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await fetch(`${EMAIL_API_URL}/welcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        return data;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};
