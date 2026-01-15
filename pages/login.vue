<script setup>
const form = ref({
  username: 'admin',
  password: '123456'
})

const handleSubmit = async () => {
  const { data } = await useApiFetch("/api/login", {
    method: "POST",
    body: form.value,
  });
  const { code, message } = data.value;

  if (code === 200) {
    await navigateTo('/profile')
  } else {
    alert(`login error: ${message}`);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.username" type="username">
    <input v-model="form.password" type="password">
    <button type="submit">登录</button>
  </form>
</template>
