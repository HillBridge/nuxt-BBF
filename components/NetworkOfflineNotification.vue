<template>
  <Transition name="network-notification">
    <div v-if="!isOnline" class="network-offline-notification">
      <div class="network-offline-notification__content">
        <div class="network-offline-notification__icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.42 9a16 16 0 0 1 21.16 0M5 12.55a11.94 11.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M12 20h.01M2 2l20 20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="network-offline-notification__text">
          <div class="network-offline-notification__title">网络连接已断开</div>
          <div class="network-offline-notification__message">
            请检查您的网络设置，网络恢复后将自动重连
          </div>
        </div>
        <button
          class="network-offline-notification__refresh"
          @click="handleRefresh"
          aria-label="刷新"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16M21 3v5M21 8h-5M3 21v-5M3 16h5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOnline } = useNetworkStatus();

const handleRefresh = () => {
  // 刷新页面
  if (import.meta.client) {
    window.location.reload();
  }
};
</script>

<style scoped>
.network-offline-notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.network-offline-notification__content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  max-width: 100%;
  margin: 0 auto;
}

.network-offline-notification__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.network-offline-notification__icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.network-offline-notification__text {
  flex: 1;
  min-width: 0;
}

.network-offline-notification__title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  line-height: 1.4;
}

.network-offline-notification__message {
  font-size: 12px;
  opacity: 0.95;
  line-height: 1.4;
}

.network-offline-notification__refresh {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
  padding: 0;
}

.network-offline-notification__refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.network-offline-notification__refresh:active {
  transform: rotate(90deg) scale(0.95);
}

.network-offline-notification__refresh svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

/* 过渡动画 */
.network-notification-enter-active,
.network-notification-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.network-notification-enter-from,
.network-notification-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .network-offline-notification__content {
    padding: 10px 16px;
    gap: 10px;
  }

  .network-offline-notification__title {
    font-size: 13px;
  }

  .network-offline-notification__message {
    font-size: 11px;
  }

  .network-offline-notification__icon {
    width: 20px;
    height: 20px;
  }

  .network-offline-notification__refresh {
    width: 28px;
    height: 28px;
  }

  .network-offline-notification__refresh svg {
    width: 16px;
    height: 16px;
  }
}
</style>
