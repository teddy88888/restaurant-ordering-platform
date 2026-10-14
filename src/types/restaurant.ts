export interface PriceRange {
  min: number;
  max: number;
}

export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: PriceRange;
  distance: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RestaurantListResponse {
  success: boolean;
  data: {
    restaurants: Restaurant[];
    pagination: Pagination;
  };
}

export interface RestaurantFilters {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}
