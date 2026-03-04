const crypto = require("crypto");
// Fallback values for running before .env is loaded in some contexts, though they should be in .env.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; // Must be 256 bits (32 characters)
const IV = process.env.ENCRYPTION_IV || "1234567890123456"; // For AES, this is always 16 bytes

const ALGORITHM = "aes-256-cbc";

function encrypt(text) {
    if (!text) return text;
    try {
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (err) {
        console.error("Encryption error:", err);
        return text;
    }
}

function decrypt(encryptedText) {
    if (!encryptedText) return encryptedText;
    
    // Check if the text is a valid hex string before attempting to decrypt,
    // to fallback gracefully for existing unencrypted data.
    const isHexString = /^[0-9a-fA-F]+$/.test(encryptedText);
    if (!isHexString) {
        return encryptedText; // It wasn't encrypted (legacy data)
    }

    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        // If decryption fails (e.g., legacy data that happens to be valid hex but wasn't encrypted by us)
        return encryptedText;
    }
}

module.exports = { encrypt, decrypt };
