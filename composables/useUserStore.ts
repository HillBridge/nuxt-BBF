export const useUserStore = () => {
  const snapshot = ref({
    isLoggedIn: false,
    userId: null,
    userInfo: {},
  });

  return {
    snapshot: readonly(snapshot),
  };
};
