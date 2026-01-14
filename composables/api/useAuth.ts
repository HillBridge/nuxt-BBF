export const useAuthApi = () => {
  const login = async (requestData: { email: string; password: string }) => {
    const { data, error } = await useFetch("/api/login", {
      method: "POST",
      body: requestData,
    });

    if (error.value) {
      throw new Error(error.value.data?.message || "登录失败");
    }

    return data.value;
  };

  const logout = async () => {
    console.log("useAuthApi-logout");
    const { data, error } = await useFetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (error.value) {
      throw new Error(error.value.data?.message || "登出失败");
    }

    return data.value;
  };

  const checkAuth = async () => {
    return useCookie("is_logged_in").value;
  };

  return { login, logout, checkAuth };
};
