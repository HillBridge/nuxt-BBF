<script setup lang="ts">

// const { fetchProfile } = useProfile()
// const { profile, error, refresh } = await fetchProfile()

interface Profile {
    username: string;
}

const { data: profile, error, refresh } = await useAsyncData<Profile>('profile', async () => {
    // *********
    // 手动添加cookie 保证刷新浏览器时服务端渲染能将token通过cookie方式传递到真实后端
    const headers = useRequestHeaders(['cookie']);
    const response = await $fetch<{ data: Profile }>('http://localhost:8888/api/profile', {
        method: "GET",
        credentials: "include",
        headers: headers
    })
    return response.data
})

// 手动刷新数据
const handleRefresh = (e: MouseEvent) => {
    e.preventDefault()
    refresh()
}
</script>

<template>
    <div v-if="error" class="error">
        获取资料失败: {{ error.message }}
        <button @click="handleRefresh">重试</button>
    </div>

    <div v-else-if="profile">
        <h1>{{ profile?.username }}</h1>
        <button @click="handleRefresh">刷新数据</button>
    </div>

    <div v-else>加载中...</div>
</template>
