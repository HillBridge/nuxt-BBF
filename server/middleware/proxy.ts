export default defineEventHandler(async (event) => {
  const is_logged_in = getCookie(event, "is_logged_in");
  console.log("middleware proxy", event.path, event.method, is_logged_in);

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
    // *******  特别针对用户手动篡改cookie的情况  *******
    // *******  与useApiFetch中的onResponse配合使用, 这里监听的是api请求接口情况  *******
    // *******  不是非常有必要, 是必须得这样写!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   *******
    // BFF层监听cookie中的is_logged_in是否存在, 不存在给客户端返回401状态码, 客户端监听到http为401状态码会自动跳转登录页面
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
