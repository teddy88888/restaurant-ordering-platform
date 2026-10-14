"use client";

import Link from "next/link";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { useRestaurants } from "@/hooks/useRestaurants";

export default function RecommendedRestaurants() {
  const { data, isLoading, isError } = useRestaurants({
    page: 1,
    limit: 12,
  });

  const restaurants = data?.data.restaurants ?? [];

  return (
    <section className="bg-white px-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recommended</h2>

          <Link
            href="/restaurants"
            className="text-xs font-medium text-red-500 transition hover:text-red-600"
          >
            See All
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-6 text-center">
            <p className="text-sm text-red-600">Failed to load restaurants.</p>
          </div>
        )}

        {!isLoading && !isError && restaurants.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No restaurants found.</p>
          </div>
        )}

        {!isLoading && !isError && restaurants.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.slice(0, 9).map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {restaurants.length > 9 && (
              <div className="mt-6 flex justify-center">
                <Link
                  href="/restaurants"
                  className="rounded-full border border-gray-200 bg-white px-6 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Show More
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
