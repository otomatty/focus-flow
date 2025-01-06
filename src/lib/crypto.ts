import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY = process.env.ENCRYPTION_KEY;

if (!KEY) {
	throw new Error("ENCRYPTION_KEY environment variable is not set");
}

// 暗号化キーをBufferに変換
const keyBuffer = Buffer.from(KEY, "hex");

// 暗号化
export function encrypt(text: string): string {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);

	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");

	const authTag = cipher.getAuthTag();

	// IV + AuthTag + 暗号化されたテキストを結合
	return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

// 復号化
export function decrypt(text: string): string {
	const [ivHex, authTagHex, encryptedHex] = text.split(":");

	const iv = Buffer.from(ivHex, "hex");
	const authTag = Buffer.from(authTagHex, "hex");
	const encrypted = Buffer.from(encryptedHex, "hex");

	const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv);
	decipher.setAuthTag(authTag);

	let decrypted = decipher.update(encrypted);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString("utf8");
}
