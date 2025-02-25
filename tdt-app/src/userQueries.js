import { useQuery, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthenticateUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/auth/protected`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("User is not authenticated");
        return null;
      }
      const data = await response.json();
      return data;
    },
    retry: false,
  });
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(["currentUser"]);
};
