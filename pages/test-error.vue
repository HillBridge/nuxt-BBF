<template>
  <div>
    <h1>错误捕获测试</h1>

    <!-- 测试1: 组件渲染错误 - 应该能被捕获 -->
    <JdErrorBoundary>
      <div>
        <h2>测试1: 组件渲染错误</h2>
        <div>{{ nonExistentVariable }}</div>
      </div>
    </JdErrorBoundary>

    <!-- 测试2: 异步错误 - 不能被捕获 -->
    <JdErrorBoundary>
      <div>
        <h2>测试2: 异步错误</h2>
        <div>{{ asyncData }}</div>
      </div>
    </JdErrorBoundary>

    <!-- 测试3: 手动抛出的错误 - 不能被捕获 -->
    <JdErrorBoundary>
      <div>
        <h2>测试3: 手动错误</h2>
        <div>{{ manualError }}</div>
      </div>
    </JdErrorBoundary>
  </div>
</template>

<script setup>
// 这个错误发生在组件渲染之前，NuxtErrorBoundary 无法捕获
const { data: asyncData } = await useSafeFetch('/api/non-existent', {
  transform: (data) => {
    throw createJdError({
      type: 'NETWORK',
      code: 'TEST_ERROR',
      message: '测试异步错误'
    })
  }
})

// 这个错误也发生在组件渲染之前
const manualError = computed(() => {
  throw createJdError({
    type: 'SYSTEM',
    code: 'MANUAL_ERROR',
    message: '测试手动错误'
  })
})
</script>
