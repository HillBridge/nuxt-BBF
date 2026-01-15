<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isVisible" class="jd-error-modal-overlay" @click.self="handleClose">
        <div class="jd-error-modal">
          <div class="modal-header">
            <div class="header-content">
              <JdLogo class="modal-logo" />
              <h3 class="modal-title">操作提示</h3>
            </div>
            <button class="close-button" @click="handleClose" aria-label="关闭">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <component :is="getErrorIllustration(error)" v-if="error" class="error-illustration" />

            <div class="error-details">
              <p class="error-message">{{ errorMessage }}</p>
              <p v-if="error?.code" class="error-code">错误代码: {{ error.code }}</p>
            </div>
          </div>

          <div class="modal-actions">
            <JdButton v-if="error?.isRetryable" type="primary" @click="handleRetry">
              重试
            </JdButton>
            <JdButton type="default" @click="handleGoHome">
              返回首页
            </JdButton>
            <JdButton type="default" @click="handleContact">
              联系客服
            </JdButton>
            <JdButton type="text" @click="handleClose">
              关闭
            </JdButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { JdError } from '~/types/error';

interface Props {
  error: JdError | null;
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  retry: [];
  goHome: [];
  contact: [];
}>();

const isVisible = computed(() => props.visible && props.error !== null);

const errorMessage = computed(() => {
  if (!props.error) return '未知错误';
  return props.error.message || getUserFriendlyMessage(props.error);
});

const getErrorIllustration = (error: JdError | null) => {
  if (!error) return null;
  switch (error.type) {
    case 'NETWORK': return resolveComponent('JdNetworkErrorIllus');
    case 'AUTH': return resolveComponent('JdAuthErrorIllus');
    case 'BUSINESS': return resolveComponent('JdBusinessErrorIllus');
    default: return resolveComponent('JdSystemErrorIllus');
  }
};

const getUserFriendlyMessage = (error: JdError) => {
  const messages: Record<string, string> = {
    NETWORK: '网络连接不稳定，请检查您的网络设置',
    AUTH: '登录状态已过期，请重新登录',
    BUSINESS: '服务繁忙，请稍后再试',
    SYSTEM: '系统暂时不可用，工程师正在处理'
  };
  return messages[error.type] || '服务异常，请重试';
};

const handleClose = () => {
  emit('close');
};

const handleRetry = () => {
  emit('retry');
  handleClose();
};

const handleGoHome = () => {
  emit('goHome');
  handleClose();
};

const handleContact = () => {
  emit('contact');
  handleClose();
};

// 按 ESC 键关闭
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible.value) {
      handleClose();
    }
  };
  window.addEventListener('keydown', handleEscape);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
.jd-error-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.jd-error-modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-logo {
  height: 28px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #e4393c;
}

.modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.error-illustration {
  width: 120px;
  height: 120px;
}

.error-details {
  text-align: center;
  width: 100%;
}

.error-message {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.error-code {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .jd-error-modal,
.modal-leave-active .jd-error-modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .jd-error-modal,
.modal-leave-to .jd-error-modal {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}
</style>
