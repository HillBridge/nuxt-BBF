import { throwJdError } from "~/utils/error";

export const useApiFetch = async <T>(url: string, options?: any) => {
  const { data, pending, error, refresh } = await useFetch<T>(url, {
    ...options,
    onResponse({ response }) {
      const code = response?._data?.code;
      const status = response?.status;
      if (code === 401 || status === 401) {
        return navigateTo("/login");
      }

      // 检查业务错误（HTTP成功但业务逻辑错误）
      if (code !== 200 && options?.showErrorModal !== false) {
        throwJdError({
          type: "BUSINESS",
          code: code?.toString() || "UNKNOWN_ERROR",
          message:
            response?._data?.msg ||
            response?._data?.message ||
            "操作失败，请稍后重试",
          severity: "MEDIUM",
          isRetryable: true,
          metadata: {
            url: url,
            responseData: response?._data,
          },
        });
      }
    },
    onResponseError(error) {
      throwJdError({
        type: "NETWORK",
        code: `HTTP_${error.response._data.statusCode}`,
        message: error.response._data.message || "网络请求失败",
        severity: error.response._data.statusCode >= 500 ? "HIGH" : "MEDIUM",
        isRetryable: error.response._data.statusCode >= 500,
        metadata: {
          statusCode: error.response._data.statusCode,
          url: url,
        },
      });
    },
  });

  // 检查 transform 是否抛出了错误
  if (data.value && options?.transform) {
    try {
      const transformedData = options.transform(data.value);
      return {
        data: transformedData,
        pending,
        error: ref(null),
        refresh,
      };
    } catch (transformError) {
      // 让 transform 中的错误冒泡
      if (import.meta.client) {
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
