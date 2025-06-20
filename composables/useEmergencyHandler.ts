export const useEmergencyHandler = () => {
  const handleCriticalError = (error: any) => {
    // 处理严重错误的逻辑
    console.error("Critical error handled:", error);

    // 可以在这里添加紧急处理逻辑，比如：
    // - 发送紧急通知
    // - 记录到日志系统
    // - 触发降级策略
  };

  return {
    handleCriticalError,
  };
};
