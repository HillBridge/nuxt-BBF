<template>
  <NuxtErrorBoundary @error="handleError">
    <slot />

    <template #fallback="{ error, reset }">
      <JdErrorBoundaryFallback :error="error" @reset="reset" />
    </template>
  </NuxtErrorBoundary>

  <!-- 显示异步错误的 fallback -->
  <JdErrorBoundaryFallback v-if="asyncError" :error="asyncError" @reset="handleAsyncErrorReset" />
</template>

<script lang="ts" setup>
import { useDevice } from '~/composables/useDevice';
import { useEmergencyHandler } from '~/composables/useEmergencyHandler';
import { useFeedback } from '~/composables/useFeedback';
import { useJdAnalytics } from '~/composables/useJdAnalytics';
import { useJdService } from '~/composables/useJdService';
import { useUserStore } from '~/composables/useUserStore';
import type { ErrorContext, JdError } from '~/types/error';

const props = defineProps<{
  context?: Partial<ErrorContext>
  fallbackStrategies?: Record<string, Function>
}>()

const emit = defineEmits(['beforeRetry', 'afterRetry'])

const { trackError } = useJdAnalytics()
const { currentRoute } = useRouter()
const userState = useUserStore()

const detailsExpanded = ref(false)
const lastError = ref<JdError | null>(null)
const retryCount = ref(0)
const asyncError = ref<JdError | null>(null)

const errorContext = computed<ErrorContext>(() => ({
  route: currentRoute.value.path,
  component: props.context?.component || 'Unknown',
  userState: userState.snapshot,
  deviceType: unref(useDevice().type),
  ...props.context
}))

const handleError = (error: any) => {
  console.log("JdErrorBoundary handleError", error);
  const normalizedError = normalizeError(error)
  lastError.value = normalizedError

  trackError({
    error: normalizedError,
    context: errorContext.value,
    severity: normalizedError.severity || 'MEDIUM'
  })

  if (normalizedError.severity === 'CRITICAL') {
    useEmergencyHandler().handleCriticalError(normalizedError)
  }
}

// 处理异步错误
const handleAsyncError = (error: any) => {
  console.log("JdErrorBoundary handleAsyncError", error);
  const normalizedError = normalizeError(error)
  asyncError.value = normalizedError
  lastError.value = normalizedError

  trackError({
    error: normalizedError,
    context: errorContext.value,
    severity: normalizedError.severity || 'MEDIUM'
  })

  if (normalizedError.severity === 'CRITICAL') {
    useEmergencyHandler().handleCriticalError(normalizedError)
  }
}

const handleAsyncErrorReset = () => {
  asyncError.value = null
  retryCount.value = 0
  emit('afterRetry', lastError.value)
}

// 添加客户端错误处理
onMounted(() => {
  // 只在客户端添加全局错误监听
  if (process.client) {
    const handleGlobalError = (event: ErrorEvent) => {
      console.log('Global error caught:', event.error);
      if (event.error && (event.error as any).code) {
        handleAsyncError(event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled promise rejection:', event.reason);
      if (event.reason && (event.reason as any).code) {
        handleAsyncError(event.reason);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // 清理函数
    onUnmounted(() => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    });
  }
})

const normalizeError = (rawError: any): JdError => {
  // 标准化错误对象
  return {
    name: rawError.name || 'UnknownError',
    message: rawError.message || '未知错误',
    stack: rawError.stack,
    code: rawError.code || `E${Date.now().toString().slice(-6)}`,
    type: rawError.type || 'SYSTEM',
    severity: rawError.severity || 'MEDIUM',
    isRetryable: rawError.isRetryable ?? true,
    timestamp: Date.now(),
    userImpact: rawError.userImpact || '部分功能可能受限',
    recoveryActions: rawError.recoveryActions || ['retry', 'home', 'contact'],
    metadata: rawError.metadata || {}
  }
}

const getErrorIllustration = (error: JdError) => {
  switch (error.type) {
    case 'NETWORK': return resolveComponent('JdNetworkErrorIllus')
    case 'AUTH': return resolveComponent('JdAuthErrorIllus')
    case 'BUSINESS': return resolveComponent('JdBusinessErrorIllus')
    default: return resolveComponent('JdSystemErrorIllus')
  }
}

const getUserFriendlyMessage = (error: JdError) => {
  const messages: Record<string, string> = {
    NETWORK: '网络连接不稳定，请检查您的网络设置',
    AUTH: '登录状态已过期，请重新登录',
    BUSINESS: '服务繁忙，请稍后再试',
    SYSTEM: '系统暂时不可用，工程师正在处理'
  }
  return error.message || messages[error.type] || '服务异常，请重试'
}

const getRecoveryActions = (error: JdError) => {
  const baseActions = [
    { key: 'retry', label: '重试', type: 'primary' as const, visible: error.isRetryable },
    { key: 'home', label: '返回首页', type: 'default' as const, visible: true },
    { key: 'contact', label: '联系客服', type: 'default' as const, visible: true },
    { key: 'feedback', label: '反馈问题', type: 'text' as const, visible: true }
  ]

  return baseActions.filter(action => action.visible)
}

const executeAction = (action: any, reset: Function) => {
  switch (action.key) {
    case 'retry':
      emit('beforeRetry', lastError.value)
      reset()
      emit('afterRetry', lastError.value)
      break
    case 'home':
      navigateTo('/')
      break
    case 'contact':
      useJdService().openCustomerChat()
      break
    case 'feedback':
      useFeedback().submitErrorReport(lastError.value)
      break
  }
}

const toggleDetails = () => {
  detailsExpanded.value = !detailsExpanded.value
}

const showTechDetails = import.meta.env.MODE === 'development'
</script>

<style scoped>
.jd-error-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: JDZH-Regular, sans-serif;
}

.error-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.error-logo {
  height: 36px;
  margin-right: 20px;
}

.error-title {
  font-size: 24px;
  color: #e4393c;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.error-details {
  text-align: center;
}

.error-message {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.error-code {
  font-size: 14px;
  color: #999;
}

.error-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.technical-details {
  margin-top: 30px;
  font-size: 12px;
  color: #666;
}

.technical-details pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
