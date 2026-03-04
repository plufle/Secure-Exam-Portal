const crypto = require("crypto");
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012";
const IV = process.env.ENCRYPTION_IV || "1234567890123456";

const ALGORITHM = "aes-256-cbc";

function encrypt(text) {
    if (text === null || text === undefined) return text;
    try {
        if (typeof text !== 'string') {
            text = JSON.stringify(text);
        }
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
    
    if (typeof encryptedText !== 'string') return encryptedText;

    const isHexString = /^[0-9a-fA-F]+$/.test(encryptedText);
    if (!isHexString) {
        return encryptedText;
    }

    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        try {
            return JSON.parse(decrypted);
        } catch (e) {
            return decrypted;
        }
    } catch (err) {
        return encryptedText;
    }
}

module.exports = { encrypt, decrypt };
