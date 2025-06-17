export default defineEventHandler(async (event) => {
  console.log("server-logout");
  // 2. 转发到真实后端
  const config = useRuntimeConfig();
  const backendUrl = `${config.backendUrl}/api/logout`;

  try {
    const response = await $fetch(backendUrl, {
      method: "POST",
      credentials: "include", // 允许携带cookie
    });

    return response;
  } catch (err: any) {
    // 3. 错误处理
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "认证服务不可用",
    });
  }
});
