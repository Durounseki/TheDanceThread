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
    enable: !!eventId,
  });
};

export const useUserEvents = (user, events) => {
  return useQuery({
    queryKey: ["userEvents", user.id],
    queryFn: () => {
      const created = events.filter((event) =>
        user.eventsCreated.some((createdEvent) => createdEvent.id === event.id)
      );
      const attending = events.filter((event) =>
        user.eventsAttending.some(
          (attendingEvent) => attendingEvent.eventId === event.id
        )
      );

      return { created, attending };
    },
    enabled: !!user && !!events,
  });
};
