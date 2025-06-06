<!-- file: app.vue -->
<script setup lang="ts">
// 1. 使用我们自定义的 useAuth hook
const { user, isLoggedIn, fetchUser, logout } = useAuth();

// --- 登录表单逻辑 (保持不变) ---
const email = ref('');
const password = ref('');
const loginError = ref('');

async function login() {
  loginError.value = '';
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    // 登录成功后，调用 fetchUser 来更新全局用户状态
    await fetchUser();
  } catch (error) {
    loginError.value = 'Login failed. Please check your credentials.';
    console.error(error);
  }
}

// 2. 在应用加载时获取用户信息
// onMounted 确保这个请求只在客户端执行一次，
// 而服务端渲染时的数据获取由下面的 useAsyncData 负责
// onMounted(fetchUser);

// 3. (可选但推荐) 为了SSR，我们仍然可以使用 useAsyncData 来预填充状态
// 这样在首次加载页面时，用户状态就已经存在，无需在客户端再次请求
// 注意：这里的 key 'user' 必须和 useState 的 key 保持一致
await useAsyncData('user', async () => {
  // 如果 `user` 状态已经有值了（可能来自客户端导航），就不再请求
  if (user.value) return user.value;
  console.log('useAsyncData')

  try {
    const data = await $fetch<{ code: number; msg: string; data?: import('~/server/utils/auth').DatabaseUser }>('/api/me');

    console.log('useAsyncData--data', data)
    // 直接更新共享状态
    user.value = data.code === 200 ? true : null;
    return data;
  } catch {
    user.value = null;
    return null;
  }
});

</script>

<template>
  <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto;">
    <h1>Nuxt 3 Secure BFF Demo</h1>

    <!-- 4. 直接使用 isLoggedIn 和 user 计算属性 -->
    <div v-if="isLoggedIn" style="background: #e0f0ff; padding: 1rem; border-radius: 8px;">
      <h2>Welcome, {{ user?.name }}!</h2>
      <p>Email: {{ user?.email }}</p>
      <button @click="logout">Logout</button>
    </div>

    <div v-else>
      <h2>Login</h2>
      <form @submit.prevent="login" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <input v-model="email" type="email" placeholder="Email (test@example.com)" required style="padding: 0.5rem;">
        <input v-model="password" type="password" placeholder="Password (password123)" required
          style="padding: 0.5rem;">
        <button type="submit" style="padding: 0.5rem;">Login</button>
        <p v-if="loginError" style="color: red;">{{ loginError }}</p>
      </form>
    </div>

    <hr style="margin: 2rem 0;">
    <h3>Debug Info:</h3>
    <pre
      style="background: #f0f0f0; padding: 1rem; border-radius: 4px; white-space: pre-wrap;">User Data: {{ user || 'Not logged in' }}</pre>
  </div>
</template>