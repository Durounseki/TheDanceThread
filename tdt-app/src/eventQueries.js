import { useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

export const useEvents = (country, style, date) => {
  return useQuery({
    queryKey: ["events", { country, style, date }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (country) queryParams.append("country", country);
      if (style) queryParams.append("style", style);
      if (date) queryParams.append("date", date);
      const queryString = queryParams.toString();
      const url = `${apiUrl}/events?${queryString ? `${queryString}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      return data;
    },
  });
};

export const useEvent = (eventId) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/events/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      return data;
    },
  });
};

export const useFirstEvent = (events, eventId) => {
  console.log("eventId in hook:", eventId);
  return useQuery({
    queryKey: ["featuredEventId", eventId],
    queryFn: () => {
      if (eventId) {
        return events.find((event) => event.id === eventId);
      } else {
        return events[0];
      }
    },
    enabled: !!events,
  });
};
