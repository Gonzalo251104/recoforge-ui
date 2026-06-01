export type ItemDTO = {
  id: number;
  title: string;
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
