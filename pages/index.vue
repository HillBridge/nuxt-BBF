<script setup>
const { login } = useAuth()
const form = ref({
    username: 'admin',
    password: '123456'
})

const handleSubmit = async () => {
    try {
        const res = await login(form.value)
        if (res.code === 200) {
            await navigateTo('/home')
        }

    } catch (err) {
        alert(err.message)
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
