import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getSimilarItems,
  type ListItemsParams,
} from "../../api/items.api";
import type { CreateItemRequestDTO, UpdateItemRequestDTO } from "../../api/types";

export function useItemsQuery(params: ListItemsParams) {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => listItems(params),
  });
}

export function useItemQuery(id: number) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => getItem(id),
    enabled: !isNaN(id) && id > 0,
  });
}

export function useSimilarItemsQuery(id: number, k: number = 5) {
  return useQuery({
    queryKey: ["items", id, "similar", k],
    queryFn: () => getSimilarItems(id, k),
    enabled: !isNaN(id) && id > 0,
  });
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemRequestDTO) => createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateItemRequestDTO }) => updateItem(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["items", variables.id] });
    },
  });
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
