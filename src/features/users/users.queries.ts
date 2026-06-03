import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listUsers,
  createUser,
  getUserProfile,
  getUserHistory,
} from "../../api/users.api";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...userKeys.lists(), { page, pageSize }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (userId: number) => [...userKeys.details(), userId] as const,
  histories: () => [...userKeys.all, "history"] as const,
  history: (userId: number, limit: number) =>
    [...userKeys.histories(), { userId, limit }] as const,
};

export function useUsersQuery(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: userKeys.list(page, pageSize),
    queryFn: () => listUsers(page, pageSize),
  });
}

export function useUserProfileQuery(userId: number | null) {
  return useQuery({
    queryKey: userKeys.detail(userId ?? 0),
    queryFn: () => getUserProfile(userId!),
    enabled: userId !== null,
  });
}

export function useUserHistoryQuery(userId: number | null, limit: number = 50) {
  return useQuery({
    queryKey: userKeys.history(userId ?? 0, limit),
    queryFn: () => getUserHistory(userId!, limit),
    enabled: userId !== null,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (username: string) => createUser(username),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
