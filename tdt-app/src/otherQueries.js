import { useQuery, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

export const useDanceStyles = () => {
  return useQuery({
    queryKey: ["danceStyles"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/styles`);
      if (!response.ok) {
        console.log("Error fetching dance styles");
        return null;
      }
      const data = await response.json();
      return data;
    },
    retry: false,
  });
};
