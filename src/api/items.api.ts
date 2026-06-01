import { api } from "./client";
import type { ItemsResponseDTO } from "./types";

export type ListItemsParams = {
  q?: string;
  city?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

export async function listItems(params: ListItemsParams = {}) {
  const res = await api.get<ItemsResponseDTO>("/items", { params });
  return res.data;
}
