export type Item = {
  id: number;
  title: string;
  city: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
};

export type ItemsResponse = {
  page: number;
  pageSize: number;
  total: number;
  results: Item[];
};
