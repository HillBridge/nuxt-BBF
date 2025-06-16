export const useSafeFetch = async <T>(url: string, options?: any) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.backendUrl;

  const { data, pending, error, refresh } = await useFetch<T>(url, {
    baseURL,
    ...options,
    credentials: "include",
    headers: {
      ...useRequestHeaders(["cookie"]),
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/?redirect=" + encodeURIComponent(useRoute().path));
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
