<template>
  <div class="error-page">
    <div class="error-container">
      <!-- Logo区域 -->
      <div class="error-header">
        <JdLogo v-if="statusCode !== 404" />
        <h1 v-if="statusCode === 404" class="error-title">页面走丢了</h1>
      </div>

      <!-- 错误内容区域 -->
      <div class="error-content">
        <!-- 404错误 -->
        <template v-if="statusCode === 404">
          <JdNotFoundErrorIllus />
          <div class="error-message">
            <h2 class="message-title">抱歉，您访问的页面不存在</h2>
            <p class="message-desc">可能是链接地址有误，或者页面已被删除</p>
          </div>
          <div class="error-actions">
            <JdButton type="primary" @click="goHome">返回首页</JdButton>
            <JdButton type="default" @click="goBack">返回上一页</JdButton>
          </div>
        </template>

        <!-- 其他错误 -->
        <template v-else>
          <JdSystemErrorIllus />
          <div class="error-message">
            <h2 class="message-title">出错了</h2>
            <p class="message-desc">{{ errorMessage }}</p>
            <p v-if="statusCode" class="error-code">错误代码: {{ statusCode }}</p>
          </div>
          <div class="error-actions">
            <JdButton type="primary" @click="goHome">返回首页</JdButton>
            <JdButton type="default" @click="handleRetry">重试</JdButton>
          </div>
        </template>
      </div>

      <!-- 开发环境显示详细信息 -->
      <div v-if="isDev && error" class="error-details">
        <details>
          <summary>错误详情（仅开发环境）</summary>
          <pre>{{ error }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 会自动注入 error prop
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}>()

console.log("error", props.error)

const statusCode = computed(() => props.error?.statusCode || 500)
const errorMessage = computed(() => {
  if (props.error?.statusMessage) {
    return props.error.statusMessage
  }
  if (props.error?.message) {
    return props.error.message
  }
  return '系统暂时不可用，请稍后再试'
})

const isDev = computed(() => import.meta.env.DEV)

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleRetry = () => {
  // 清除错误状态并重新加载当前页面
  clearError()
  router.push(router.currentRoute.value.path)
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.error-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 60px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-header {
  margin-bottom: 40px;
}

.error-title {
  font-size: 32px;
  color: #e4393c;
  margin: 0;
  font-weight: bold;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.error-message {
  text-align: center;
}

.message-title {
  font-size: 24px;
  color: #333;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.message-desc {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.error-code {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-details {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #f0f0f0;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  user-select: none;
}

.error-details pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #333;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .error-container {
    padding: 40px 20px;
  }

  .error-title {
    font-size: 24px;
  }

  .message-title {
    font-size: 20px;
  }

  .message-desc {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
  }

  .error-actions .jd-button {
    width: 100%;
  }
}
</style>
