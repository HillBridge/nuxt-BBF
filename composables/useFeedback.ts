export const useFeedback = () => {
  const submitErrorReport = (error: any) => {
    // 提交错误反馈的逻辑
    console.log("Submitting error report:", error);

    // 这里可以集成实际的反馈系统
    // 比如发送到后端API、打开反馈表单等
  };

  return {
    submitErrorReport,
  };
};
