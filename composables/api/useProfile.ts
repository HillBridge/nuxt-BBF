interface Profile {
  username: string;
}

interface ProfileResponse {
  data: Profile;
}

export const useProfileApi = () => {
  const fetchProfileInfo = async () => {
    const response = await useSafeFetch<ProfileResponse>("/api/profile");

    return {
      ...response,
      profile: response.data.value?.data,
    };
  };

  return { fetchProfileInfo };
};
