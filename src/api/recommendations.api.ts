import { api } from "./client";
import type { RecommendationsResponseDTO } from "./types";

export async function getRecommendations(
  userId: number,
  strategy: string = "content",
  k: number = 10,
  contentWeight: number = 0.5,
  userWeight: number = 0.5
): Promise<RecommendationsResponseDTO> {
  const response = await api.get<RecommendationsResponseDTO>(
    `/recommendations/${userId}`,
    {
      params: {
        strategy,
        k,
        content_weight: contentWeight,
        user_weight: userWeight,
      },
    }
  );
  return response.data;
}
