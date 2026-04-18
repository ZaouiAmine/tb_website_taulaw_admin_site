// encryption.ts
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// DETERMINISTIC: Encrypts key names (for localStorage keys)
export function encryptKey(key: string): string {
  return CryptoJS.SHA256(key).toString(); // always same output for same input
}

// NON-DETERMINISTIC: Encrypts sensitive values (tokens)
export function encryptValue(value: string): string {
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
}

export function decryptValue(encryptedValue: string): string {
  if (!encryptedValue) return "";

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption failed, decrypted will be empty string
    if (!decrypted) {
      console.warn("Decryption failed: invalid data or wrong key.");
      return "";
    }
    return decrypted;
  } catch (error) {
    console.error("Error decrypting value:", error);
    return "";
  }
}
