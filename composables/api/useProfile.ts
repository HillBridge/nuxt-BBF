interface Profile {
  username: string;
}

interface ProfileResponse {
  data: Profile;
}

export const useProfileApi = () => {
  const fetchProfileInfo = async () => {
    const response = await useServerFetch<ProfileResponse>("/api/profile");
    console.log("fetchProfileInfo", response);

    return {
      ...response,
      profile: response.data.value?.data,
    };
  };

  return { fetchProfileInfo };
};
