<template>
  <div class="jd-error-container">
    <div class="error-header">
      <JdLogo class="error-logo" />
      <h2 class="error-title">服务暂时不可用 22</h2>
    </div>

    <div class="error-content">
      <component :is="getErrorIllustration(error)" />

      <div class="error-details">
        <p class="error-message">{{ getUserFriendlyMessage(error) }}</p>
        <p v-if="error.code" class="error-code">错误代码: {{ error.code }}</p>
      </div>

      <div class="error-actions">
        <JdButton v-for="action in getRecoveryActions(error)" :key="action.key" :type="action.type"
          @click="executeAction(action)">
          {{ action.label }}
        </JdButton>
      </div>
    </div>

    <div v-if="showTechDetails" class="technical-details">
      <p @click="toggleDetails">技术详情 ▼</p>
      <pre v-if="detailsExpanded">{{ error.stack }}</pre>
    </div>

    <!-- 自定义操作插槽 -->
    <div v-if="$slots['custom-actions']" class="custom-actions">
      <slot name="custom-actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { JdError } from '~/types/error';

const props = defineProps<{
  error: JdError;
}>();

const emit = defineEmits(['reset']);

const detailsExpanded = ref(false);

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

const executeAction = (action: any) => {
  switch (action.key) {
    case 'retry':
      emit('reset')
      break
    case 'home':
      navigateTo('/')
      break
    case 'contact':
      useJdService().openCustomerChat()
      break
    case 'feedback':
      useFeedback().submitErrorReport(props.error)
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

.custom-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
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
