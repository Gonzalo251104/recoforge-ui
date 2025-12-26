import { useQuery } from "@tanstack/react-query";
import type { ItemsResponse } from "../types/item";
import { fetchItems } from "../api/items.api";

export function useItems(page = 1, pageSize = 20) {
  return useQuery<ItemsResponse>({
    queryKey: ["items", page, pageSize],
    queryFn: () => fetchItems(page, pageSize),
  });
}
