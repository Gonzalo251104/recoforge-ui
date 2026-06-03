import { api } from "./client";
import type {
  ItemsResponseDTO,
  ItemDTO,
  CreateItemRequestDTO,
  UpdateItemRequestDTO,
  RecommendedItemDTO,
} from "./types";

export type ListItemsParams = {
  q?: string;
  city?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

export async function listItems(params: ListItemsParams = {}): Promise<ItemsResponseDTO> {
  const res = await api.get<ItemsResponseDTO>("/items", { params });
  return res.data;
}

export async function getItem(id: number): Promise<ItemDTO> {
  const res = await api.get<ItemDTO>(`/items/${id}`);
  return res.data;
}

export async function createItem(payload: CreateItemRequestDTO): Promise<ItemDTO> {
  const res = await api.post<ItemDTO>("/items", payload);
  return res.data;
}

export async function updateItem(id: number, payload: UpdateItemRequestDTO): Promise<ItemDTO> {
  const res = await api.put<ItemDTO>(`/items/${id}`, payload);
  return res.data;
}

export async function deleteItem(id: number): Promise<{ status: string; message: string }> {
  const res = await api.delete<{ status: string; message: string }>(`/items/${id}`);
  return res.data;
}

export async function getSimilarItems(id: number, k: number = 5): Promise<RecommendedItemDTO[]> {
  const res = await api.get<RecommendedItemDTO[]>(`/items/${id}/similar`, {
    params: { k },
  });
  return res.data;
}
