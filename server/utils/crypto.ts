import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

/**
 * 加密 cookie 值
 * @param text 要加密的文本
 * @param secretKey 密钥（如果未提供，从环境变量获取）
 * @returns 加密后的字符串（格式：iv:authTag:encryptedData）
 */
export function encryptCookie(text: string, secretKey?: string): string {
  const key =
    secretKey ||
    process.env.COOKIE_SECRET_KEY ||
    "default-secret-key-change-in-production";

  // 生成盐值并派生密钥
  const salt = randomBytes(16);
  const keyDerived = scryptSync(key, salt, 32);

  // 生成随机 IV
  const iv = randomBytes(16);

  // 使用 AES-256-GCM 加密
  const cipher = createCipheriv("aes-256-gcm", keyDerived, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 获取认证标签
  const authTag = cipher.getAuthTag();

  // 返回格式：salt:iv:authTag:encryptedData
  return `${salt.toString("hex")}:${iv.toString("hex")}:${authTag.toString(
    "hex"
  )}:${encrypted}`;
}

/**
 * 解密 cookie 值
 * @param encryptedText 加密的文本（格式：salt:iv:authTag:encryptedData）
 * @param secretKey 密钥（如果未提供，从环境变量获取）
 * @returns 解密后的原始文本
 */
export function decryptCookie(
  encryptedText: string,
  secretKey?: string
): string | null {
  try {
    const key =
      secretKey ||
      process.env.COOKIE_SECRET_KEY ||
      "default-secret-key-change-in-production";

    // 解析加密字符串
    const parts = encryptedText.split(":");
    if (parts.length !== 4) {
      throw new Error("Invalid encrypted format");
    }

    const [saltHex, ivHex, authTagHex, encrypted] = parts;

    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    // 派生密钥
    const keyDerived = scryptSync(key, salt, 32);

    // 解密
    const decipher = createDecipheriv("aes-256-gcm", keyDerived, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Cookie decryption failed:", error);
    return null;
  }
}
