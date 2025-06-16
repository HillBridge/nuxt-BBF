export default defineEventHandler(async (event) => {
  // 1. 获取客户端请求体
  const body = await readBody(event);

  // 2. 转发到真实后端
  const config = useRuntimeConfig();
  const backendUrl = `${config.backendUrl}/api/login`;

  const response: any = await $fetch(backendUrl, {
    method: "POST",
    body,
    credentials: "include", // 允许携带cookie
  }).catch((err) => {
    // 3. 错误处理
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "认证服务不可用",
    });
  });

  // 6. 返回净化后的数据
  return response;
});
