import { api } from "./client";
import type { AllStrategyMetricsResponseDTO, StrategyMetricsDTO } from "./types";

export async function getOfflineMetrics(
  strategy: string,
  k: number = 10,
  users: number = 20
): Promise<StrategyMetricsDTO> {
  const response = await api.get<StrategyMetricsDTO>("/metrics/offline", {
    params: { strategy, k, users },
  });
  return response.data;
}

export async function getAllOfflineMetrics(
  k: number = 10,
  users: number = 20
): Promise<AllStrategyMetricsResponseDTO> {
  const response = await api.get<AllStrategyMetricsResponseDTO>("/metrics/offline/all", {
    params: { k, users },
  });
  return response.data;
}
