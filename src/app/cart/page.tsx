"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const restaurantGroups = useMemo(() => {
    return items.reduce<Record<string, typeof items>>((groups, item) => {
      const restaurantId = String(item.restaurantId);

      if (!groups[restaurantId]) {
        groups[restaurantId] = [];
      }

      groups[restaurantId].push(item);
      return groups;
    }, {});
  }, [items]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

  return (
    <>
      <Navbar variant="inner" />

      <main className="mt-14 mb-14 min-h-screen bg-white px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8">
          <h1 className="font-[family-name:var(--font-nunito)] text-[32px] font-extrabold leading-tight text-[#0A0D12]">
            My Cart
          </h1>

          {items.length === 0 ? (
            <section className="rounded-2xl border border-gray-100 px-6 py-16 text-center shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
              <div className="mb-4 text-5xl">🛒</div>
              <h2 className="text-xl font-bold text-[#0A0D12]">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Add your favorite food to get started.
              </p>

              <Link
                href="/restaurants"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#C12116] px-8 font-bold text-white transition hover:bg-[#a91c12]"
              >
                Explore Restaurants
              </Link>
            </section>
          ) : (
            <>
              {Object.entries(restaurantGroups).map(
                ([restaurantId, restaurantItems]) => (
                  <section
                    key={restaurantId}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {restaurantItems[0].image ? (
                          <img
                            src={restaurantItems[0].image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm">🍽️</span>
                        )}
                      </div>

                      <h2 className="min-w-0 flex-1 font-[family-name:var(--font-nunito)] text-lg font-bold text-[#0A0D12]">
                        {restaurantItems[0].restaurantName}
                      </h2>

                      <span
                        aria-hidden="true"
                        className="text-xl text-gray-500"
                      >
                        ⌄
                      </span>
                    </div>

                    {restaurantItems.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && (
                          <div className="mb-5 border-t border-dashed border-[#D5D7DA]" />
                        )}

                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.foodName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-2xl">
                                🍔
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-medium text-[#0A0D12] sm:text-base">
                              {item.foodName}
                            </h3>
                            <p className="mt-2 text-base font-extrabold text-[#0A0D12] sm:text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              aria-label={`Kurangi ${item.foodName}`}
                              onClick={() => removeItem(item.id)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D5D7DA] text-xl text-[#0A0D12] transition hover:bg-gray-100 sm:h-10 sm:w-10"
                            >
                              −
                            </button>

                            <span className="min-w-5 text-center text-base font-semibold text-[#0A0D12] sm:text-lg">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label={`Tambah ${item.foodName}`}
                              onClick={() =>
                                addItem({
                                  id: item.id,
                                  restaurantId: item.restaurantId,
                                  restaurantName: item.restaurantName,
                                  foodName: item.foodName,
                                  price: item.price,
                                  image: item.image,
                                })
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C12116] text-xl text-white transition hover:bg-[#a91c12] sm:h-10 sm:w-10"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                ),
              )}

              <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-t border-dashed border-[#D5D7DA] pt-5">
                  <span className="text-base font-semibold text-[#0A0D12]">
                    Total
                  </span>
                  <span className="text-xl font-extrabold text-[#0A0D12]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex h-12 w-full items-center justify-center self-center rounded-full bg-[#C12116] px-8 font-bold text-white transition hover:bg-[#a91c12] sm:w-[240px]"
                >
                  Checkout
                </Link>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
