export const useDevice = () => {
  const type = ref("desktop");

  // 检测设备类型
  if (process.client) {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      type.value = "mobile";
    } else if (/Tablet|iPad/.test(userAgent)) {
      type.value = "tablet";
    }
  }

  return {
    type: readonly(type),
  };
};
