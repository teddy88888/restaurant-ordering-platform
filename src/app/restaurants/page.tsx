import { getRestaurants, type Restaurant } from "@/lib/restaurantApi";
import Navbar from "@/components/home/Navbar";
import RestaurantFilters from "@/components/restaurant/RestaurantFilters";

export default async function RestaurantsPage() {
  let restaurants: Restaurant[] = [];

  try {
    const response = await getRestaurants({ page: 1, limit: 20 });
    restaurants = response.data.restaurants;
  } catch {
    restaurants = [];
  }

  return (
    <>
      <Navbar variant="inner" />

      <main className="min-h-screen bg-white px-5 pb-16 pt-28 sm:px-8 lg:px-[120px]">
        <h1 className="font-[var(--font-fredoka)] text-3xl font-semibold text-[#0A0D12]">
          All Restaurants
        </h1>

        <p className="mt-2 text-gray-500">
          Discover restaurants and find your next favorite meal.
        </p>

        {restaurants.length === 0 ? (
          <p className="mt-8 rounded-xl bg-gray-50 p-6 text-gray-600">
            Restaurants could not be loaded. Please try again later.
          </p>
        ) : (
          <RestaurantFilters restaurants={restaurants} />
        )}
      </main>
    </>
  );
}
