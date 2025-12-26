import { api } from "./client";
import type { ItemsResponse } from "../types/item";

export async function fetchItems(
  page = 1,
  pageSize = 20
): Promise<ItemsResponse> {
  const res = await api.get<ItemsResponse>("/items", {
    params: { page, page_size: pageSize },
  });
  return res.data;
}
