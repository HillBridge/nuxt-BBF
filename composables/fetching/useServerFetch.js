export const useServerFetch = (event, url, options = {}) => {
  const token = getHeader(event, "Authorization");

  console.log("useServerFetch", token, options);

  return $fetch(url, {
    ...options,
    headers: {
      Authorization: token || "",
      ...options?.headers,
    },
  });
};

// export const useServerFetch = async <T>(url: string, options?: any) => {
//   const config = useRuntimeConfig();
//   const token = getHeader(event, "Authorization");

//   return $fetch(url, {
//     baseURL: config.apiBaseUrl,
//     ...options,
//     headers: {
//       Authorization: token || "",
//       ...options.headers,
//     },
//   });
// const cookies = useRequestHeaders(["cookie"]);

// const { data, pending, error, refresh } = await useFetch<T>(url, {
//   ...options,
//   credentials: "include",
//   onResponse({ response }) {
//     if (response._data.code === 401 || response.status === 401) {
//       return navigateTo("/login");
//     }
//   },
// });
// };
