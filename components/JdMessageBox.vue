<template>
  <Teleport to="body">
    <Transition name="message-box">
      <div v-if="isVisible" class="jd-message-box-overlay" @click.self="handleOverlayClick">
        <div class="jd-message-box" :class="messageBoxClasses">
          <div class="jd-message-box__header">
            <div class="jd-message-box__icon">
              <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
              </svg>
              <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="jd-message-box__title">{{ title }}</h3>
            <button class="jd-message-box__close" @click="handleClose" aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <div class="jd-message-box__content">
            <p class="jd-message-box__message">{{ message }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
interface Props {
  type?: 'success' | 'error';
  title?: string;
  message: string;
  visible?: boolean;
  closeOnClickOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  title: '',
  visible: false,
  closeOnClickOverlay: false
});

const emit = defineEmits<{
  'update:visible': [value: boolean];
  close: [];
}>();

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const messageBoxClasses = computed(() => {
  return {
    'jd-message-box--success': props.type === 'success',
    'jd-message-box--error': props.type === 'error'
  };
});

const handleClose = () => {
  isVisible.value = false;
  emit('close');
};

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose();
  }
};
</script>

<style scoped>
.jd-message-box-overlay {
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

.jd-message-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.jd-message-box__header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
}

.jd-message-box__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jd-message-box--success .jd-message-box__icon {
  color: #52c41a;
}

.jd-message-box--error .jd-message-box__icon {
  color: #ff4d4f;
}

.jd-message-box__icon svg {
  width: 100%;
  height: 100%;
}

.jd-message-box__title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.jd-message-box__close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.jd-message-box__close:hover {
  background: #f5f5f5;
  color: #333;
}

.jd-message-box__close svg {
  width: 18px;
  height: 18px;
}

.jd-message-box__content {
  padding: 24px;
  overflow-y: auto;
}

.jd-message-box__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  word-wrap: break-word;
}

/* 过渡动画 */
.message-box-enter-active,
.message-box-leave-active {
  transition: opacity 0.3s ease;
}

.message-box-enter-active .jd-message-box,
.message-box-leave-active .jd-message-box {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.message-box-enter-from,
.message-box-leave-to {
  opacity: 0;
}

.message-box-enter-from .jd-message-box,
.message-box-leave-to .jd-message-box {
  transform: scale(0.9);
  opacity: 0;
}
</style>
