// Validation utilities for checkout and forms

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateRwandaPhone = (phone) => {
    // Rwanda phone format: +250 7XX XXX XXX or 07XX XXX XXX
    // Accepts: +250788123456, 0788123456, 250788123456, 788123456
    const phoneRegex = /^(\+?250|0)?7[0-9]{8}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
};

export const validateBankAccount = (account) => {
    // Bank account should be 10-16 digits
    const accountRegex = /^[0-9]{10,16}$/;
    const cleanAccount = account.replace(/\s/g, '');
    return accountRegex.test(cleanAccount);
};

export const validateFullName = (name) => {
    // At least 2 words, each at least 2 characters
    const nameRegex = /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}(\s+[a-zA-Z]+)*$/;
    return nameRegex.test(name.trim());
};

export const validateDeliveryDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date must be today or in the future
    if (selectedDate < today) {
        return { valid: false, message: 'Delivery date cannot be in the past' };
    }

    // Date should not be more than 90 days in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    if (selectedDate > maxDate) {
        return { valid: false, message: 'Delivery date cannot be more than 90 days in the future' };
    }

    return { valid: true };
};

export const normalizePhone = (phone) => {
    // Normalize phone number to +250 format
    let cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '+250' + cleaned.substring(1);
    } else if (cleaned.startsWith('250')) {
        cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+')) {
        cleaned = '+250' + cleaned;
    }
    return cleaned;
};

export const formatPhoneDisplay = (phone) => {
    // Format phone for display: +250 788 123 456
    const normalized = normalizePhone(phone);
    return normalized.replace(/(\+250)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
};

export const validateAddress = (address) => {
    // Address should be at least 10 characters
    return address.trim().length >= 10;
};

export const sanitizeInput = (input) => {
    // Remove potentially harmful characters
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
