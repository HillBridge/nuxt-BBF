export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();

  // 避免在客户端 hydration 阶段重复执行
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return;
  }

  // 检查是否已登录（通过 API 验证）
  const { checkAuth } = useAuthApi();
  const isLoggedIn = await checkAuth();

  // 排除登录页面和公开路由
  const publicRoutes = ["/login", "/register", "/forgot-password"];

  // 如果用户已登录且访问登录页，重定向到首页
  if (isLoggedIn && publicRoutes.includes(to.path)) {
    return navigateTo("/", {
      redirectCode: 302,
      external: false,
    });
  }

  // 如果用户未登录且访问受保护页面，重定向到登录页
  if (!isLoggedIn && !publicRoutes.includes(to.path)) {
    return navigateTo("/login", {
      redirectCode: 302,
      external: false,
    });
  }
});
