import crypto from 'crypto';

// Generate secure random token
export const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash token for storage
export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate token with expiry (1 hour)
export const createPasswordResetToken = () => {
    const token = generateResetToken();
    const hashedToken = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    return {
        token, // Send this in email
        hashedToken, // Store this in database
        expiresAt
    };
};
