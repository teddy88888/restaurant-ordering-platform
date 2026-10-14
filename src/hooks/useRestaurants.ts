import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/lib/api/resto";
import type { RestaurantFilters } from "@/types/restaurant";

export function useRestaurants(filters: RestaurantFilters = {}) {
  return useQuery({
    queryKey: ["restaurants", filters],
    queryFn: () => getRestaurants(filters),
  });
}
