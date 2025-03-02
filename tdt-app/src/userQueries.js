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
        if (response.status === 401) {
          throw new Error("User not authenticated");
        } else {
          throw new Error(`Something went wrong: ${response.status}`);
        }
      }
      const data = await response.json();
      return data;
    },
    retry: false,
  });
};
