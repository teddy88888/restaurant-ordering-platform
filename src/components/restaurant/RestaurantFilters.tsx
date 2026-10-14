"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import type { Restaurant } from "@/lib/restaurantApi";
import Footer from "@/components/home/Footer";

interface Props {
  restaurants: Restaurant[];
}

const ratingOptions = [5, 4, 3, 2, 1];

function getPriceBounds(priceRange: unknown): [number, number] | null {
  if (typeof priceRange === "number" && Number.isFinite(priceRange)) {
    return [priceRange, priceRange];
  }

  const matches = String(priceRange ?? "").match(/\d[\d.,]*/g);

  if (!matches?.length) return null;

  const prices = matches
    .map((value) => Number(value.replace(/[.,]/g, "")))
    .filter(Number.isFinite);

  if (!prices.length) return null;

  return [Math.min(...prices), Math.max(...prices)];
}

export default function RestaurantFilters({ restaurants }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants.map((restaurant) => restaurant.category).filter(Boolean),
        ),
      ).sort(),
    [restaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const minimum = minPrice === "" ? null : Number(minPrice);
    const maximum = maxPrice === "" ? null : Number(maxPrice);

    return restaurants.filter((restaurant) => {
      const categoryMatches =
        selectedCategories.length === 0 ||
        selectedCategories.includes(restaurant.category);

      const rating = Number(restaurant.star);
      const ratingMatches =
        selectedRating === null ||
        (Number.isFinite(rating) && rating >= selectedRating);

      const bounds = getPriceBounds(restaurant.priceRange);

      const priceMatches =
        (minimum === null && maximum === null) ||
        (bounds !== null &&
          (maximum === null || bounds[0] <= maximum) &&
          (minimum === null || bounds[1] >= minimum) &&
          (minimum === null || maximum === null || minimum <= maximum));

      return categoryMatches && ratingMatches && priceMatches;
    });
  }, [restaurants, selectedCategories, selectedRating, minPrice, maxPrice]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function resetFilters() {
    setSelectedCategories([]);
    setSelectedRating(null);
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <>
      <Navbar variant="inner" />
      <div className="mt-8 mb-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 rounded-xl border border-[#F0F0F0] bg-white p-6 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] lg:sticky lg:top-24 lg:w-[266px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-[var(--font-nunito)] text-xl font-extrabold text-[#0A0D12]">
              Filter
            </h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-[#C12116] hover:underline"
            >
              Reset
            </button>
          </div>

          <section className="border-b border-[#EEEEEE] pb-6">
            <h3 className="mb-4 font-[var(--font-nunito)] font-bold text-[#0A0D12]">
              Categories
            </h3>

            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-3 text-sm text-[#0A0D12]"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 accent-[#C12116]"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}

              {categories.length === 0 && (
                <p className="text-sm text-gray-500">
                  No categories available.
                </p>
              )}
            </div>
          </section>

          <section className="border-b border-[#EEEEEE] py-6">
            <h3 className="mb-4 font-[var(--font-nunito)] font-bold text-[#0A0D12]">
              Price Range
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="min-w-0">
                <span className="mb-2 block text-xs text-gray-500">
                  Minimum (Rp)
                </span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="0"
                  className="h-10 w-full min-w-0 rounded-lg border border-[#D5D7DA] px-2 text-sm outline-none focus:border-[#C12116]"
                />
              </label>

              <label className="min-w-0">
                <span className="mb-2 block text-xs text-gray-500">
                  Maximum (Rp)
                </span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="500000"
                  className="h-10 w-full min-w-0 rounded-lg border border-[#D5D7DA] px-2 text-sm outline-none focus:border-[#C12116]"
                />
              </label>
            </div>

            {minPrice !== "" &&
              maxPrice !== "" &&
              Number(minPrice) > Number(maxPrice) && (
                <p className="mt-2 text-xs text-red-600">
                  Minimum price must not exceed maximum price.
                </p>
              )}
          </section>

          <section className="pt-6">
            <h3 className="mb-4 font-[var(--font-nunito)] font-bold text-[#0A0D12]">
              Rating
            </h3>

            <div className="space-y-3">
              {ratingOptions.map((rating) => (
                <label
                  key={rating}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedRating === rating}
                    onChange={() =>
                      setSelectedRating((current) =>
                        current === rating ? null : rating,
                      )
                    }
                    className="h-4 w-4 accent-[#C12116]"
                  />

                  <span className="flex items-center gap-1">
                    {Array.from({ length: rating }, (_, index) => (
                      <Star
                        key={index}
                        size={15}
                        className="fill-[#FFAB0D] text-[#FFAB0D]"
                      />
                    ))}
                    <span className="ml-1 text-[#555555]">{rating}+</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#0A0D12]">
                {filteredRestaurants.length}
              </span>{" "}
              of {restaurants.length} restaurants
            </p>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">
              <p className="font-semibold text-[#0A0D12]">
                No restaurants match your filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-sm font-semibold text-[#C12116] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-48 items-center justify-center bg-gray-50 p-5">
                    <img
                      src={restaurant.logo}
                      alt={`${restaurant.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-[var(--font-nunito)] text-xl font-bold text-[#0A0D12]">
                      {restaurant.name}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {restaurant.place}
                      </span>

                      <span className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="fill-[#FFAB0D] text-[#FFAB0D]"
                        />
                        {restaurant.star}
                      </span>
                    </div>

                    <p className="mt-3 text-sm capitalize text-[#C12116]">
                      {restaurant.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
