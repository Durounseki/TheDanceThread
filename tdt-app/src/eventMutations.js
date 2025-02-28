import { useMutation, useQueryClient } from "@tanstack/react-query";
const apiUrl = import.meta.env.VITE_API_URL;

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      const response = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: {
          "X-CSRF-Token": queryClient.getQueryData(["csrfToken"]),
        },
        body: variables.formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error creating event");
      }
      return response.json();
    },
    onSettled: (data, error, variables) => {
      const { userId } = variables;
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["userEvents", userId] });
      queryClient.invalidateQueries({ queryKey: ["csrfToken"] });
    },
  });
};

export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      const { formData, event } = variables;
      const response = await fetch(`${apiUrl}/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "X-CSRF-Token": queryClient.getQueryData(["csrfToken"]),
        },
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error updating event");
      }
      return response.json();
    },
    onSettled: (data, error, variables) => {
      const { event } = variables;
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      queryClient.invalidateQueries({ queryKey: ["csrfToken"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      const { eventId } = variables;
      const response = await fetch(`${apiUrl}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": queryClient.getQueryData(["csrfToken"]),
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting event");
      }
    },
    onMutate: async (variables) => {
      const { eventId, userId } = variables;
      await queryClient.cancelQueries({ queryKey: ["events"] });
      await queryClient.cancelQueries({ queryKey: ["event", eventId] });
      await queryClient.cancelQueries({ queryKey: ["userEvents", userId] });
      const previousEvents = queryClient.getQueryData(["events"]);
      const previousUserEvents = queryClient.getQueryData([
        "userEvents",
        userId,
      ]);
      queryClient.setQueryData(["events"], (oldEvents) =>
        oldEvents.filter((event) => event.id !== eventId)
      );
      queryClient.setQueryData(["userEvents", userId], (oldEvents) => ({
        ...oldEvents,
        created: oldEvents.created.filter((event) => event.id !== eventId),
      }));

      return { previousEvents, previousUserEvents };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["events"], context.previousEvents);
      queryClient.setQueryData(
        ["userEvents", variables.userId],
        context.previousUserEvents
      );
    },
    onSettled: (data, error, variables) => {
      const { eventId, userId } = variables;
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["userEvents", userId] });
      queryClient.invalidateQueries({ queryKey: ["csrfToken"] });
    },
  });
};
