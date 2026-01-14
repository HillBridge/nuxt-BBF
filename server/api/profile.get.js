export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.backendUrl;

  const token = getDecryptedAuthToken(event, config.cookieSecretKey);

  const response = await $fetch("/api/profile", {
    baseURL: backendUrl,
    method: "GET",
    headers: {
      cookie: `auth_token=${token};`,
    },
  });

  return response;
});
