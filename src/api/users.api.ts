import { api } from "./client";
import type {
  UserListResponseDTO,
  UserProfileResponseDTO,
  UserHistoryResponseDTO,
  UserDTO,
} from "./types";

export async function listUsers(
  page: number = 1,
  pageSize: number = 20
): Promise<UserListResponseDTO> {
  const response = await api.get<UserListResponseDTO>("/users", {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

export async function createUser(username: string): Promise<UserDTO> {
  const response = await api.post<UserDTO>("/users", { username });
  return response.data;
}

export async function getUserProfile(
  userId: number
): Promise<UserProfileResponseDTO> {
  const response = await api.get<UserProfileResponseDTO>(`/users/${userId}`);
  return response.data;
}

export async function getUserHistory(
  userId: number,
  limit: number = 50
): Promise<UserHistoryResponseDTO> {
  const response = await api.get<UserHistoryResponseDTO>(
    `/users/${userId}/history`,
    {
      params: { limit },
    }
  );
  return response.data;
}
