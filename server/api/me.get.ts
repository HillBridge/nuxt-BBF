// file: server/api/me.get.ts

export default defineEventHandler(async (event): Promise<any> => {

    // 从运行时配置中获取后端服务的URL
    const config = useRuntimeConfig();
  
    // 1. 检查用户是否已登录。
    // `event.context.user` 是由 `server/middleware/auth.ts` 中间件注入的。
    // 由于我们已经正确配置了类型声明，TypeScript 知道 `event.context.user`
    // 的类型是 `User | null`。
    if (!event.context.user) {
      // 如果用户未登录，抛出一个标准的 401 Unauthorized 错误。
      // Nuxt/Nitro 会自动处理这个错误并将其作为HTTP响应发送给客户端。
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Unauthorized--中间层',
    //   });
        
      return { code: 401, msg: 'Unauthorized-中间层' };
    }
  
    // 2. 如果代码执行到这里，TypeScript 会自动推断出 `event.context.user` 不再是 null，
    // 而是 `User` 类型。因此，访问 `event.context.user.id` 是类型安全的。
    try {
      // 将请求转发到真实的后端服务，并附上用户的ID作为身份凭证。
      // 真实后端服务会用这个ID来查询并返回用户的详细信息。
      const userProfile = await $fetch(`${config.mockBackendUrl}/api/me`, {
        headers: {
          // 这里的 `event.context.user.id` 不会报错，因为类型检查通过了。
          'X-User-Id': event.context.user.id
        }
      });
      
      // 成功从后端获取到数据后，记录一条日志。
      console.log(`[BFF] Successfully fetched user info for ${event.context.user.id}`);
  
      // 将从后端获取到的用户信息直接返回给前端客户端。
      return userProfile;
  
    } catch (error: any) {
      // 3. 处理从真实后端获取数据时可能发生的错误。
      // 例如，真实后端服务可能宕机，或者返回了非2xx的状态码。
      console.error(`[BFF] Failed to get user info from backend for user ${event.context.user.id}:`, error.data || error);
  
      // 抛出一个 502 Bad Gateway 错误，这是一个标准的HTTP状态码，
      // 表示作为网关或代理的服务器，从上游服务器收到了无效的响应。
      // 这清晰地表明问题出在BFF与真实后端之间的通信环节。
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to retrieve user information from the backend service.',
      });
    }
  });