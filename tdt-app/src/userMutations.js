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

export const useSaveProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      const { formData, user } = variables;
      const response = await fetch(`${apiUrl}/users/${user.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error updating profile");
      }
    },
    onMutate: async (variables) => {
      const { formData, user } = variables;
      const { name, email, country, bio, styles, sns } = formData;
      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser"], {
        ...user,
        name: name,
        email: email,
        country: country ? country : "",
        bio: bio ? bio : "",
        styles: styles ? styles : [],
        sns: sns ? sns : [],
      });
    },
    onError: (err, variables) => {
      const { user } = variables;
      queryClient.setQueryData(["currentUser"], user);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdatePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      const { user, formData } = variables;
      const response = await fetch(`${apiUrl}/users/${user.id}/profile-pic`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error updating profile picture");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useDeletePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      const response = await fetch(`${apiUrl}/users/${user.id}/profile-pic`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting profile picture");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting user");
      }
    },
    onSettled: (data, error, userId) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userEvents", userId] });
    },
  });
};
