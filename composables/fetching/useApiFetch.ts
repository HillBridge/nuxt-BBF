import { throwJdError } from "~/utils/error";

export const useApiFetch = async <T>(url: string, options?: any) => {
  const { data, pending, error, refresh } = await useFetch<T>(url, {
    ...options,
    onResponse({ response }) {
      if (response._data.code === 401 || response.status === 401) {
        return navigateTo("/login");
      }

      // 检查业务错误（HTTP成功但业务逻辑错误）
      if (
        response._data &&
        typeof response._data === "object" &&
        "code" in response._data
      ) {
        const responseData = response._data as any;

        // 如果业务返回的 code 不是 200，且没有设置 showErrorModal: false，则显示错误弹出框
        if (responseData.code !== 200 && options?.showErrorModal !== false) {
          console.log("useApiFetch------onResponse", responseData);
          // 只在客户端显示弹出框
          if (import.meta.client) {
            const errorModal = useErrorModal();
            errorModal.showError({
              type: "BUSINESS",
              code: responseData.code?.toString() || "UNKNOWN_ERROR",
              message:
                responseData.msg ||
                responseData.message ||
                "操作失败，请稍后重试",
              severity: "MEDIUM",
              isRetryable: true,
              metadata: {
                url: url,
                responseData: responseData,
              },
            });
          }
        }
      }
    },
  });

  // if (error.value) {
  //   const statusCode = error.value.statusCode || 500;
  //   throwJdError({
  //     type: "NETWORK",
  //     code: `HTTP_${statusCode}`,
  //     message: error.value.message || "网络请求失败",
  //     severity: statusCode >= 500 ? "HIGH" : "MEDIUM",
  //     isRetryable: statusCode >= 500,
  //     metadata: {
  //       statusCode: statusCode,
  //       url: url,
  //     },
  //   });
  // }

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
