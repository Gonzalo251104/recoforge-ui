import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, type CreateEventPayload } from "../../api/events.api";

export function useCreateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    onSuccess: (_, payload) => {
      // Invalidate recommendations, user history, and profile stats
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["userHistory", payload.userId] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", payload.userId] });
      queryClient.invalidateQueries({ queryKey: ["users", payload.userId] });
    },
  });
}
