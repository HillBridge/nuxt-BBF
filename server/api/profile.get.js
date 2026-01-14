export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.backendUrl;

  const token = getDecryptedAuthToken(event, config.cookieSecretKey);

  try {
    const response = await $fetch("/api/profile", {
      baseURL: backendUrl,
      method: "GET",
      headers: {
        cookie: `auth_token=${token};`,
      },
    });

    console.log("server-profile-data", response);

    return response;
  } catch (err) {
    console.log("server-profile-error", err);
    // 3. 错误处理
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "认证服务不可用",
    });
  }
});
