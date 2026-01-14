export default defineEventHandler(async (event) => {
  const is_logged_in = getCookie(event, "is_logged_in");
  // console.log("middleware proxy", event.path, event.method, is_logged_in);

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

  const whitelist = ["/api/login", "/api/register", "/api/forgot-password"];

  if (!is_logged_in && !whitelist.includes(event.path)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // const config = useRuntimeConfig();
  // const backendUrl = `${config.backendUrl}${event.path}`;
  // const token = getDecryptedAuthToken(event, config.cookieSecretKey);
  // console.log("middleware proxy-token", token);

  // const response = await $fetch.raw(backendUrl, {
  //   method: event.method,
  //   body: event.method === "POST" ? await readBody(event) : undefined,
  //   credentials: "include",
  //   headers: {
  //     auth_token: token || "",
  //   },
  // });

  // console.log("middleware proxy-response", response);

  // return response;
});
