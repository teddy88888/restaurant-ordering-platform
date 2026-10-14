import { api } from "./axios";
import type {
  RestaurantFilters,
  RestaurantListResponse,
} from "@/types/restaurant";

export async function getRestaurants(
  filters: RestaurantFilters = {},
): Promise<RestaurantListResponse> {
  const response = await api.get<RestaurantListResponse>("/api/resto", {
    params: filters,
  });

  return response.data;
}
