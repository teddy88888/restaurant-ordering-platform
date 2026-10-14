import Link from "next/link";
import type { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="block">
      <article className="flex min-h-[120px] items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-md">
        {/* Restaurant logo */}
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {restaurant.logo ? (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-gray-400">No Image</span>
          )}
        </div>

        {/* Restaurant information */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-semibold text-gray-900">
            {restaurant.name}
          </h3>

          <div className="mt-1 flex items-center gap-1">
            <span className="text-[14px] text-amber-500">★</span>

            <span className="text-[14px] font-medium text-gray-700">
              {restaurant.star}
            </span>
          </div>

          <p className="mt-1 truncate text-[13px] text-gray-500">
            {restaurant.place} · {restaurant.distance} km
          </p>
        </div>
      </article>
    </Link>
  );
}
