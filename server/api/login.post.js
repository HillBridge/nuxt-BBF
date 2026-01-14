export default defineEventHandler(async (event) => {
  // 1. 获取客户端请求体
  const body = await readBody(event);

  const config = useRuntimeConfig();
  const backendUrl = config.backendUrl;

  const data = await $fetch("/api/login", {
    baseURL: backendUrl,
    method: "POST",
    body,
  });

  console.log("server-login data", data);

  // 2. 从后端响应中提取 token
  if (data?.code === 200 && data?.data?.token) {
    const token = data.data.token;

    // 3. 加密 token（加盐处理）
    const { encryptCookie } = await import("~/server/utils/crypto");
    const encryptedToken = encryptCookie(token, config.cookieSecretKey);

    // console.log(
    //   "server-login decrypt",
    //   getDecryptedAuthToken(event, config.cookieSecretKey)
    // );

    // 4. 通过 cookie 将加密后的 token 下传到客户端
    setCookie(event, "auth_token", encryptedToken, {
      httpOnly: true, // 防止 XSS 攻击，JavaScript 无法访问
      path: "/",
      maxAge: 5, // 1小时，与后端 JWT 过期时间一致
      secure: process.env.NODE_ENV === "production", // 生产环境使用 HTTPS
      sameSite: "lax", // 防止 CSRF 攻击
    });

    // 可选：设置一个客户端可读的登录状态标识
    setCookie(event, "is_logged_in", "true", {
      httpOnly: false, // 客户端可以读取
      path: "/",
      maxAge: 5,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return {
      ...data,
      data: {
        ...data?.data,
        token: encryptedToken,
      },
    };
  }
});
