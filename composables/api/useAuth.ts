export const useAuthApi = () => {
  const login = async (credentials: { email: string; password: string }) => {
    const { data, error } = await useFetch("/api/login", {
      method: "POST",
      body: credentials,
      credentials: "include", // 必须开启
    });

    if (error.value) {
      throw new Error(error.value.data?.message || "登录失败");
    }

    return data.value;
  };

  return { login };
};
