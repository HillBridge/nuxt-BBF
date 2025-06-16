export default defineEventHandler(async (event) => {
  console.log("middleware proxy", event.path);

  // 只代理API请求
  if (!event.path.startsWith("/api")) return;

  // 验证请求来源: 安全加固域名和协议: 包括https协议, 指定客户端的域名请求
  const origin = getRequestHeader(event, "origin");

  if (origin && !origin.startsWith("http://localhost:3000")) {
    // 403: 禁止访问
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const config = useRuntimeConfig();
  const backendUrl = `${config.backendUrl}/api/login`;

  const response = await $fetch.raw(backendUrl, {
    method: "POST",
    body: await readBody(event),
    credentials: "include",
  });

  // 获取后端设置的Cookie
  const authCookie = response.headers
    .get("set-cookie")
    ?.split(";")
    ?.find((c: any) => c.trim().startsWith("auth_token="))
    ?.split("=")[1];

  // 设置客户端Cookie
  if (authCookie) {
    setCookie(event, "auth_token", authCookie, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      secure: true, // https
      sameSite: "none",
    });
  }
});
