import { createJdError } from "~/utils/error";

export default defineNuxtPlugin(() => {
  // 在 Nuxt 3 中，$fetch 没有 create 方法
  // 我们可以通过全局拦截器来处理错误
  const nuxtApp = useNuxtApp();

  console.log("plugin-nuxtApp");

  // 添加全局错误处理器
  nuxtApp.hook("app:error", (error: any) => {
    console.log("plugin-app:error", error.statusCode);
    if (error?.statusCode === 401) {
      throw createJdError({
        type: "AUTH",
        code: "UNAUTHORIZED",
        message: "请重新登录",
        severity: "HIGH",
      });
    }

    if (error?.statusCode === 429) {
      throw createJdError({
        type: "NETWORK",
        code: "RATE_LIMIT",
        message: "操作过于频繁",
        isRetryable: true,
        userImpact: "请稍后再试",
      });
    }

    // 处理业务错误
    if (error?.data?.code) {
      throw createJdError({
        type: "BUSINESS",
        code: error.data.code,
        message: error.data.message || "业务异常",
        isRetryable: error.data.retryable,
        metadata: error.data.data,
      });
    }

    // 处理网络错误
    if (error?.statusCode >= 500) {
      throw createJdError({
        type: "NETWORK",
        code: "API_REQUEST_FAILED",
        message: "网络请求失败",
        isRetryable: true,
      });
    }
  });
});
