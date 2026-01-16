/**
 * 网络状态检测 Composable
 * 用于检测设备的在线/离线状态
 */
export const useNetworkStatus = () => {
  // 网络状态
  const isOnline = ref(true);
  const wasOffline = ref(false); // 记录是否曾经断网

  // 仅在客户端执行
  if (import.meta.client) {
    // 初始化状态
    isOnline.value = navigator.onLine;
    wasOffline.value = !navigator.onLine;

    // 监听在线事件
    const handleOnline = () => {
      isOnline.value = true;
      // 如果之前是离线状态，现在恢复在线，可以触发一些操作
      if (wasOffline.value) {
        wasOffline.value = false;
        // 可以在这里触发页面刷新或其他操作
        console.log('网络已恢复连接');
      }
    };

    // 监听离线事件
    const handleOffline = () => {
      isOnline.value = false;
      wasOffline.value = true;
      console.log('网络连接已断开');
    };

    // 添加事件监听器
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 清理函数
    onUnmounted(() => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });
  }

  return {
    isOnline: readonly(isOnline),
    wasOffline: readonly(wasOffline),
  };
};
