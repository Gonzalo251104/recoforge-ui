import { useQuery } from "@tanstack/react-query";
import { getOfflineMetrics, getAllOfflineMetrics } from "../../api/metrics.api";

export function useOfflineMetricsQuery(strategy: string, k: number = 10, users: number = 20) {
  return useQuery({
    queryKey: ["metrics", "offline", strategy, k, users],
    queryFn: () => getOfflineMetrics(strategy, k, users),
    staleTime: 5000,
  });
}

export function useAllOfflineMetricsQuery(k: number = 10, users: number = 20) {
  return useQuery({
    queryKey: ["metrics", "offline", "all", k, users],
    queryFn: () => getAllOfflineMetrics(k, users),
    staleTime: 5000,
  });
}
