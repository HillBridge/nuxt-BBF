export default defineEventHandler(async (event) => {
  // console.log("middleware proxy", event.path, event.method);

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
  const backendUrl = `${config.backendUrl}${event.path}`;

  const response = await $fetch.raw(backendUrl, {
    method: event.method,
    body: event.method === "POST" ? await readBody(event) : undefined,
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

    setCookie(event, "is_logged_in", "9999", {
      httpOnly: false,
      path: "/",
      maxAge: 3600,
      secure: true, // https
      sameSite: "none",
    });
  }

  return response._data;
});
