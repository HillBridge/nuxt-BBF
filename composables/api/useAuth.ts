export const useAuthApi = () => {
  const checkAuth = async () => {
    return useCookie("is_logged_in").value;
  };

  return { checkAuth };
};
