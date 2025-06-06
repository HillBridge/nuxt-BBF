// file: composables/useAuth.ts

// 导入我们之前在后端定义的用户类型，以实现端到端的类型安全
import type { DatabaseUser } from '~/server/utils/auth';

export const useAuth = () => {
  // 使用 useState 创建一个可在应用中全局共享的响应式状态
  // 'user' 是这个状态的唯一key
  // () => null 指定了初始值
  const user = useState<DatabaseUser | null | any>('user', () => null);

  // 判断用户是否已登录的计算属性
  const isLoggedIn = computed(() => !!user.value);

  // 定义一个异步函数来从 BFF 获取当前用户信息
  const fetchUser = async () => {
    console.log('fetchUser', user.value )
    // 只有在 user.value 为 null 时才发起请求，避免不必要的重复请求
    // 你也可以根据需要移除这个判断，以便总是能获取最新的用户信息
    if (user.value === null) {
      try {
        // $fetch 是 Nuxt 提供的通用数据获取函数
        // 它会自动处理 SSR 和客户端的请求
        const data = await $fetch<DatabaseUser>('/api/me', {
          // 如果请求失败（例如401未授权），不抛出错误，而是返回 null
          // 这样可以优雅地处理未登录状态
          ignoreResponseError: true,
        });

        console.log('data', data)
        user.value = data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        user.value = null;
      }
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      // 向BFF发送登出请求
      await $fetch('/api/auth/logout', { method: 'POST' });
      // 登出成功后，将本地状态清空
      user.value = null;
      // 也可以选择跳转到登录页
      // await navigateTo('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isLoggedIn,
    fetchUser,
    logout,
  };
};