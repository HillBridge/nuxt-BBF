<script setup lang="ts">
const { fetchProfileInfo } = useProfileApi();
const { profile, error, pending, refresh } = await fetchProfileInfo();


// 手动刷新数据
const handleRefresh = (e: MouseEvent) => {
    e.preventDefault()
    refresh()
}
</script>

<template>
    <div v-if="error?.message" class="error">
        获取资料失败: {{ error.message }}
        <button @click="handleRefresh">重试</button>
    </div>

    <div v-else-if="pending">加载中...</div>

    <div v-else>
        <h1>username: {{ profile?.username }}</h1>
        <button @click="handleRefresh">刷新数据</button>
    </div>
</template>
