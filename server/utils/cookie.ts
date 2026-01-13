import type { H3Event } from "h3";
import { getCookie } from "h3";
import { decryptCookie } from "./crypto";

/**
 * 获取并解密 auth_token cookie
 * @param event H3 事件对象
 * @param secretKey 密钥（可选，默认从 runtimeConfig 获取）
 * @returns 解密后的 token 或 null
 */
export function getDecryptedAuthToken(
  event: H3Event,
  secretKey?: string
): string | null {
  const encryptedToken = getCookie(event, "auth_token");

  if (!encryptedToken) {
    return null;
  }

  const config = useRuntimeConfig();
  const key = secretKey || config.cookieSecretKey;

  return decryptCookie(encryptedToken, key);
}
