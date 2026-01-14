import { throwJdError } from "~/utils/error";

/**
 * 从 cookie 字符串中解析指定名称的 cookie 值
 * @param cookieString cookie 字符串，格式: "key1=value1; key2=value2"
 * @param name 要查找的 cookie 名称
 * @returns cookie 值或 null
 */
function getCookieFromString(
  cookieString: string | undefined,
  name: string
): string | null {
  if (!cookieString) return null;

  const cookies = cookieString.split(";").map((cookie) => cookie.trim());
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!targetCookie) return null;

  return targetCookie.substring(name.length + 1);
}

export const useClientFetch = async <T>(url: string, options?: any) => {
  const headers = useRequestHeaders(["cookie"]);
  const cookieString = headers.cookie;

  // 从 cookie 字符串中解析 auth_token
  const authToken = getCookieFromString(cookieString, "auth_token");

  console.log("useClientFetch-cookies", cookieString);
  console.log("useClientFetch-auth_token", authToken);

  const { data, pending, error, refresh } = await useFetch<T>(url, {
    ...options,
    credentials: "include",
    headers: {
      ...headers,
      // 如果需要将 auth_token 作为单独的 header 传递，可以取消下面的注释
      // ...(authToken && { auth_token: authToken }),
    },
    onResponse({ response }) {
      if (response._data.code === 401 || response.status === 401) {
        return navigateTo("/login");
      }
    },
  });

  if (error.value) {
    const statusCode = error.value.statusCode || 500;
    throwJdError({
      type: "NETWORK",
      code: `HTTP_${statusCode}`,
      message: error.value.message || "网络请求失败",
      severity: statusCode >= 500 ? "HIGH" : "MEDIUM",
      isRetryable: statusCode >= 500,
      metadata: {
        statusCode: statusCode,
        url: url,
      },
    });
  }

  // 检查 transform 是否抛出了错误
  if (data.value && options?.transform) {
    try {
      const transformedData = options.transform(data.value);
      console.log("transformedData", transformedData);
      return {
        data: transformedData,
        pending,
        error: ref(null),
        refresh,
      };
    } catch (transformError) {
      // 让 transform 中的错误冒泡
      if (process.client) {
        throwJdError({
          type: "SYSTEM",
          code: "TRANSFORM_ERROR",
          message: "数据转换失败",
          metadata: { originalError: transformError },
        });
      }
      throw transformError;
    }
  }

  // 直接返回 data，方便解构
  return { data, pending, error, refresh };
};
