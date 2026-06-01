import { useQuery } from "@tanstack/react-query";
import { listItems, type ListItemsParams } from "../../api/items.api";

export function useItemsQuery(params: ListItemsParams) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => listItems(params),
  });
}
