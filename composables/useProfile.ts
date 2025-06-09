// composables/useProfile.ts
interface Profile {
  username: string;
}

export const useProfile = () => {
  const fetchProfile = async () => {
    const config = useRuntimeConfig();

    const backendUrl = `${config.backendUrl}/api/profile`;

    console.log("backendUrl", backendUrl);

    const { data, error, refresh } = await useFetch<{ data: Profile }>(
      backendUrl,
      {
        method: "GET",
        credentials: "include", // 必须包含凭证
        // headers: {
        //   "Cache-Control": "no-cache", // 避免缓存干扰
        // },
        onResponseError({ response }) {
          // 处理401未授权
          if (response.status === 401) {
            navigateTo(
              "/login?redirect=" + encodeURIComponent(useRoute().path)
            );
          }
        },
      }
    );

    return {
      profile: data.value?.data,
      error,
      refresh,
    };
  };

  return { fetchProfile };
};
