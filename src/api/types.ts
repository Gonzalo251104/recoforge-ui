export type ItemDTO = {
  id: number;
  title: string;
  description?: string;
  city: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
};

export type ItemsResponseDTO = {
  page: number;
  pageSize: number;
  total: number;
  results: ItemDTO[];
};

export type UserDTO = {
  id: number;
  username: string;
  createdAt: string;
};

export type UserStatsDTO = {
  totalViews: number;
  totalClicks: number;
  totalSaves: number;
  favoriteTags: string[];
};

export type UserProfileResponseDTO = {
  id: number;
  username: string;
  createdAt: string;
  stats: UserStatsDTO;
};

export type UserListResponseDTO = {
  page: number;
  pageSize: number;
  total: number;
  results: UserDTO[];
};

export type HistoryItemDTO = {
  id: number;
  title: string;
  description?: string;
  city: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
};

export type HistoryEntryDTO = {
  eventId: number;
  eventType: "view" | "click" | "save";
  ts: string;
  item: HistoryItemDTO;
};

export type UserHistoryResponseDTO = {
  userId: number;
  limit: number;
  results: HistoryEntryDTO[];
};

export type RecommendedItemDTO = {
  id: number;
  title: string;
  description?: string;
  city: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
  score: number;
  explanation: string;
};

export type RecommendationsResponseDTO = {
  userId: number;
  strategy: string;
  k: number;
  results: RecommendedItemDTO[];
};

export type CreateItemRequestDTO = {
  title: string;
  description?: string;
  city: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
};

export type UpdateItemRequestDTO = {
  title?: string;
  description?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
};
