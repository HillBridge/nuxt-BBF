export const useSafeFetch = async <T>(url: string, options?: any) => {
  const headers = useRequestHeaders(["cookie"]);
  const config = useRuntimeConfig();
  const baseURL = config.public.backendUrl;

  const { data, pending, error, refresh } = await useFetch<T>(url, {
    baseURL,
    ...options,
    credentials: "include",
    headers: {
      ...headers,
    },
    onResponse({ response }) {
      if (response._data.code === 401) {
        return navigateTo("/login");
      }
    },
  });

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode,
      message: error.value.message,
    });
  }

  return { data, pending, error, refresh };
};
