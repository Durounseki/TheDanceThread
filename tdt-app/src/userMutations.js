import { useMutation, useQueryClient } from "@tanstack/react-query";
const apiUrl = import.meta.env.VITE_API_URL;

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error logging out");
      }
    },
    onError: (err) => {
      console.error("Failed to logout:", err);
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userEvents", userId] });
    },
  });
};

export const useBookmarkEvent = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isBookmarked) => {
      const method = isBookmarked ? "DELETE" : "POST";
      await fetch(`${apiUrl}/events/${eventId}/saves`, {
        method: method,
        credentials: "include",
      });
    },
    onMutate: async (isBookmarked) => {
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      const currentUser = queryClient.getQueryData(["currentUser"]);
      queryClient.setQueryData(["currentUser"], (oldUser) => {
        if (isBookmarked) {
          return {
            ...oldUser,
            savedEvents: oldUser.savedEvents.filter((id) => id !== eventId),
          };
        } else {
          return { ...oldUser, savedEvents: [...oldUser.savedEvents, eventId] };
        }
      });
      return currentUser;
    },
    onError: (err, context) => {
      queryClient.setQueryData(["currentUser"], context.currentUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useLikeEvent = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isLiked) => {
      const method = isLiked ? "DELETE" : "POST";
      await fetch(`${apiUrl}/events/${eventId}/likes`, {
        method: method,
        credentials: "include",
      });
    },
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      await queryClient.cancelQueries({ queryKey: ["event", eventId] });
      const currentUser = queryClient.getQueryData(["currentUser"]);
      const currentEvent = queryClient.getQueryData(["event", eventId]);
      queryClient.setQueryData(["currentUser"], (oldUser) => {
        if (isLiked) {
          return {
            ...oldUser,
            likedEvents: oldUser.likedEvents.filter((id) => id !== eventId),
          };
        } else {
          return { ...oldUser, likedEvents: [...oldUser.likedEvents, eventId] };
        }
      });
      queryClient.setQueryData(["event", eventId], (oldEvent) => {
        if (isLiked) {
          return {
            ...oldEvent,
            totalLikes: oldEvent.totalLikes - 1,
            likes: oldEvent.likes.filter(
              (like) => like.user.id !== currentUser.id
            ),
          };
        } else {
          return {
            ...oldEvent,
            totalLikes: oldEvent.totalLikes + 1,
            likes: [
              ...oldEvent.likes,
              { user: { id: currentUser.id, name: currentUser.name } },
            ],
          };
        }
      });
      return { currentUser, currentEvent };
    },
    onError: (err, context) => {
      console.error("Error updating event like:", err);
      queryClient.setQueryData(["currentUser"], context.currentUser);
      queryClient.setQueryData(["event", eventId], context.currentEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

export const useAttendEvent = (eventId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isAttending) => {
      const method = isAttending ? "DELETE" : "POST";
      await fetch(`${apiUrl}/events/${eventId}/attendees`, {
        method: method,
        credentials: "include",
      });
    },
    onMutate: async (isAttending) => {
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      await queryClient.cancelQueries({ queryKey: ["event", eventId] });
      const currentUser = queryClient.getQueryData(["currentUser"]);
      const currentEvent = queryClient.getQueryData(["event", eventId]);
      queryClient.setQueryData(["currentUser"], (oldUser) => {
        if (isAttending) {
          return {
            ...oldUser,
            eventsAttending: oldUser.eventsAttending.filter(
              (event) => event.id !== eventId
            ),
          };
        } else {
          return {
            ...oldUser,
            eventsAttending: [
              ...oldUser.eventsAttending,
              { eventId: eventId, type: "GOING" },
            ],
          };
        }
      });
      queryClient.setQueryData(["event", eventId], (oldEvent) => {
        if (isAttending) {
          return {
            ...oldEvent,
            attendees: oldEvent.attendees.filter(
              (attendee) => attendee.user.id !== currentUser.id
            ),
            totalAttendees: oldEvent.totalAttendees - 1,
          };
        } else {
          return {
            ...oldEvent,
            attendees: [
              oldEvent.attendees,
              {
                user: { id: currentUser.id, name: currentUser.name },
                type: "GOING",
              },
            ],
          };
        }
      });
      return { currentUser, currentEvent };
    },
    onError: (err, context) => {
      queryClient.setQueryData(["currentUser"], context.currentUser);
      queryClient.setQueryData(["event", eventId], context.currentEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({
        queryKey: ["userEvents", queryClient.getQueryData("currentUser").id],
      });
    },
  });
};
