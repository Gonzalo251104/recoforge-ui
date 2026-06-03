import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../../api/recommendations.api";

export const recommendationKeys = {
  all: ["recommendations"] as const,
  user: (userId: number) => [...recommendationKeys.all, userId] as const,
  strategy: (
    userId: number,
    strategy: string,
    k: number,
    contentWeight: number,
    userWeight: number
  ) =>
    [
      ...recommendationKeys.user(userId),
      { strategy, k, contentWeight, userWeight },
    ] as const,
};

export function useRecommendationsQuery(
  userId: number | null,
  strategy: string = "content",
  k: number = 10,
  contentWeight: number = 0.5,
  userWeight: number = 0.5
) {
  return useQuery({
    queryKey: recommendationKeys.strategy(
      userId ?? 0,
      strategy,
      k,
      contentWeight,
      userWeight
    ),
    queryFn: () =>
      getRecommendations(userId!, strategy, k, contentWeight, userWeight),
    enabled: userId !== null,
  });
}
