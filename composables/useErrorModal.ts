import type { JdError } from "~/types/error";
import { createJdError } from "~/utils/error";

export const useErrorModal = () => {
  // 使用 useState 确保全局状态一致
  const error = useState<JdError | null>("errorModal.error", () => null);
  const visible = useState<boolean>("errorModal.visible", () => false);

  const showError = (errorData: Partial<JdError> | JdError) => {
    // 如果已经是 JdError 类型，直接使用；否则创建
    const jdError =
      "code" in errorData && "type" in errorData
        ? (errorData as JdError)
        : createJdError(errorData);

    error.value = jdError;
    visible.value = true;
  };

  const hideError = () => {
    visible.value = false;
    // 延迟清除错误，等待动画完成
    setTimeout(() => {
      error.value = null;
    }, 300);
  };

  const handleRetry = () => {
    // 重试逻辑由调用方处理
    // 可以通过 metadata 中的 refresh 函数来实现重试
    console.log("Retry action triggered");
  };

  const handleGoHome = () => {
    navigateTo("/");
  };

  const handleContact = () => {
    useJdService().openCustomerChat();
  };

  return {
    error: readonly(error),
    visible: readonly(visible),
    showError,
    hideError,
    handleRetry,
    handleGoHome,
    handleContact,
  };
};
