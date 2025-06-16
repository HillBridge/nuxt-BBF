interface Profile {
  username: string;
}

interface ProfileResponse {
  data: Profile;
}

export const useProfile = () => {
  const fetchProfileInfo = async () => {
    const response = await useSafeFetch<ProfileResponse>("/api/profile", {
      method: "GET",
      credentials: "include",
    });

    return {
      ...response,
      profile: response.data.value?.data,
    };
  };

  return { fetchProfileInfo };
};
