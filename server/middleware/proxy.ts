export default defineEventHandler(async (event) => {
  // 只代理API请求
  if (!event.path.startsWith("/api")) return;

  // 验证请求来源
  const origin = getRequestHeader(event, "origin");

  if (origin && !origin.startsWith("http://localhost:3000")) {
    throw createError({ statusCode: 403 });
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
