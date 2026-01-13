<script setup>
const { login } = useAuthApi()
const form = ref({
  username: 'admin',
  password: '123456'
})

const handleSubmit = async () => {
  try {
    const { data } = await useServerFetch("/api/login", {
      method: "POST",
      body: form.value,
    });
    const { code, message } = data.value;

    console.log("data", data.value, code, message);
    if (code === 200) {
      console.log("navigate to profile");
      await navigateTo('/profile')
    } else {
      alert(`login error: ${message}`);
    }

  } catch (err) {
    alert(`error: ${err.message}`);
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
