import { throwJdError } from "~/utils/error";

export const useSafeFetch = async <T>(url: string, options?: any) => {
  const headers = useRequestHeaders(["cookie"]);
  const config = useRuntimeConfig();
  const baseURL = config.public.backendUrl;

  const { data, pending, error, refresh } = await useFetch<T>(url, {
    baseURL,
    ...options,
    credentials: "include",
    headers: {
      ...headers,
    },
    onResponse({ response }) {
      if (response._data.code === 401) {
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
      return {
        data: ref(transformedData),
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

  return { data, pending, error, refresh };
};
