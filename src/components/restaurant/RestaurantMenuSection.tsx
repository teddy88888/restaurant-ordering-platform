"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import type { RestaurantMenu } from "@/lib/restaurantApi";
import { useCartStore } from "@/store/cartStore";

interface Props {
  restaurantId: number;
  restaurantName: string;
  menus: RestaurantMenu[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ShareButton({ restaurantName }: { restaurantName: string }) {
  async function shareRestaurant() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: restaurantName,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Restaurant link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Unable to share restaurant:", error);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={shareRestaurant}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D5D7DA] px-6 text-sm font-semibold transition hover:border-[#C12116] hover:text-[#C12116]"
    >
      <Share2 size={17} />
      Share
    </button>
  );
}

export default function RestaurantMenuSection({
  restaurantId,
  restaurantName,
  menus,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(menus.map((menu) => menu.type).filter(Boolean))),
  ];

  const filteredMenus =
    activeCategory === "All"
      ? menus
      : menus.filter((menu) => menu.type === activeCategory);

  function quantityFor(menuId: number) {
    if (!mounted) return 0;

    return (
      items.find(
        (item) => item.id === menuId && item.restaurantId === restaurantId,
      )?.quantity ?? 0
    );
  }

  return (
    <section id="menu" className="border-b border-[#EEEEEE] py-12 sm:py-16">
      <div className="mb-6">
        <h2 className="font-[var(--font-nunito)] text-3xl font-extrabold sm:text-4xl">
          Menu
        </h2>
        <p className="mt-2 text-sm text-[#777777]">
          Discover delicious food and drinks from {restaurantName}.
        </p>
      </div>

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-full border px-6 py-3 text-sm font-semibold capitalize transition ${
              activeCategory === category
                ? "border-[#C12116] bg-[#FFECEC] text-[#C12116]"
                : "border-[#D5D7DA] bg-white text-[#181818] hover:border-[#C12116]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredMenus.length === 0 ? (
        <div className="rounded-2xl bg-[#FAFAFA] p-10 text-center text-[#777777]">
          No menu available in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMenus.map((menu) => {
            const quantity = quantityFor(menu.id);

            return (
              <article
                key={menu.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-[#FAFAFA]">
                  {menu.image ? (
                    <img
                      src={menu.image}
                      alt={menu.foodName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#AAAAAA]">
                      <ShoppingBag size={42} />
                    </div>
                  )}
                </div>

                <div className="flex min-h-[112px] flex-col justify-between gap-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 font-[var(--font-nunito)] text-base font-semibold">
                      {menu.foodName}
                    </h3>
                    <p className="mt-1 font-[var(--font-nunito)] text-lg font-extrabold text-[#181818]">
                      {formatPrice(menu.price)}
                    </p>
                  </div>

                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: menu.id,
                          restaurantId,
                          restaurantName,
                          foodName: menu.foodName,
                          price: menu.price,
                          image: menu.image,
                        })
                      }
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#C12116] text-sm font-bold text-white transition hover:bg-[#A71D13]"
                    >
                      <Plus size={17} />
                      Add
                    </button>
                  ) : (
                    <div className="flex h-10 items-center justify-between rounded-full border border-[#C12116] px-2">
                      <button
                        type="button"
                        onClick={() => removeItem(menu.id)}
                        aria-label={`Remove one ${menu.foodName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFECEC] text-[#C12116]"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-bold">{quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            id: menu.id,
                            restaurantId,
                            restaurantName,
                            foodName: menu.foodName,
                            price: menu.price,
                            image: menu.image,
                          })
                        }
                        aria-label={`Add one ${menu.foodName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C12116] text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
