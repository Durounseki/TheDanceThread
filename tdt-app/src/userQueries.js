import { useQuery } from "@tanstack/react-query";

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
        return null;
      }
      const data = await response.json();
      return data;
    },
    retry: false,
  });
};
