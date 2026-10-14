export type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  distance: number;
};

export type RestaurantResponse = {
  success: boolean;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type RestaurantFilters = {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://be-restaurant-production.up.railway.app";

export async function getRestaurants(
  filters: RestaurantFilters = {},
): Promise<RestaurantResponse> {
  const params = new URLSearchParams();

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.range !== undefined) {
    params.set("range", String(filters.range));
  }

  if (filters.priceMin !== undefined) {
    params.set("priceMin", String(filters.priceMin));
  }

  if (filters.priceMax !== undefined) {
    params.set("priceMax", String(filters.priceMax));
  }

  if (filters.rating !== undefined) {
    params.set("rating", String(filters.rating));
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 20));

  const response = await fetch(`${API_URL}/api/resto?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  return response.json();
}

export type RestaurantMenu = {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
};

export type RestaurantReview = {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: {
    lat: number;
    long: number;
  };
  distance: number;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: RestaurantMenu[];
  reviews: RestaurantReview[];
};

export type RestaurantDetailResponse = {
  success: boolean;
  data: RestaurantDetail;
};

export async function getRestaurantDetail(
  id: number | string,
  limitMenu = 10,
  limitReview = 6,
): Promise<RestaurantDetailResponse> {
  const params = new URLSearchParams({
    limitMenu: String(limitMenu),
    limitReview: String(limitReview),
  });

  const response = await fetch(
    `${API_URL}/api/resto/${id}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Restaurant not found");
    }

    throw new Error("Failed to fetch restaurant detail");
  }

  return response.json();
}