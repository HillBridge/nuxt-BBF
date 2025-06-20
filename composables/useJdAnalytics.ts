export const useJdAnalytics = () => {
  const trackError = (data: { error: any; context: any; severity: string }) => {
    // 错误追踪逻辑
    console.warn("Error tracked:", data);
  };

  return {
    trackError,
  };
};
