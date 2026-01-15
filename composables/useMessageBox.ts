export interface MessageBoxOptions {
  type: "success" | "error";
  title?: string;
  message: string;
  closeOnClickOverlay?: boolean;
}

interface MessageBoxState {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  closeOnClickOverlay: boolean;
}

const state = reactive<MessageBoxState>({
  visible: false,
  type: "success",
  title: "",
  message: "",
  closeOnClickOverlay: false,
});

export const useMessageBox = () => {
  const showMessage = (options: MessageBoxOptions) => {
    state.type = options.type;
    state.title =
      options.title || (options.type === "success" ? "成功" : "错误");
    state.message = options.message;
    state.closeOnClickOverlay = options.closeOnClickOverlay || false;
    state.visible = true;
  };

  const hideMessage = () => {
    state.visible = false;
  };

  const handleClose = () => {
    hideMessage();
  };

  return {
    state: readonly(state),
    showMessage,
    hideMessage,
    handleClose,
  };
};
