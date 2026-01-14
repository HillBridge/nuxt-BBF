export const useAuthApi = () => {
  const logout = async () => {
    const { data, error } = await useApiFetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    console.log("useAuthApi-logout", error.value);

    if (error.value) {
      throw new Error(error.value.data?.message || "登出失败");
    }

    return data.value;
  };

  const checkAuth = async () => {
    return useCookie("is_logged_in").value;
  };

  return { logout, checkAuth };
};
