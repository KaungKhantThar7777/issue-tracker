import { useQuery } from "react-query";

export const useUserData = (userId) => {
  const userData = useQuery(
    ["users", userId],
    ({ signal }) =>
      fetch(`/api/users/${userId}`, { signal }).then((res) => res.json()),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );

  return userData;
};
