"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

type OrderStatus = "All" | "Pending" | "Processing" | "Completed" | "Cancelled";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  restaurant: string;
  restaurantImage: string;
  status: Exclude<OrderStatus, "All">;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: "ORD-001",
    restaurant: "Burger King",
    restaurantImage: "/images/burger-king.png",
    status: "Completed",
    items: [
      {
        id: 1,
        name: "Cheeseburger",
        price: 50000,
        quantity: 2,
        image: "/images/cheeseburger.png",
      },
    ],
  },
  {
    id: "ORD-002",
    restaurant: "Burger King",
    restaurantImage: "/images/burger-king.png",
    status: "Processing",
    items: [
      {
        id: 2,
        name: "Chicken Burger",
        price: 50000,
        quantity: 2,
        image: "/images/chicken-burger.png",
      },
    ],
  },
];

const statuses: OrderStatus[] = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00a0/g, " ");

export default function MyOrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.restaurant.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        selectedStatus === "All" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto flex w-full max-w-[1200px] items-start gap-8 px-6 py-12">
        <ProfileSidebar />

        <section className="min-w-0 flex-1">
          <h1 className="mb-6 font-[var(--font-nunito)] text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
            My Orders
          </h1>

          <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(16,24,40,0.08)]">
            <div className="mb-5 flex h-11 max-w-[598px] items-center gap-3 rounded-full border border-[#D0D5DD] px-4">
              <svg
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[#667085]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                aria-label="Search orders"
                className="w-full bg-transparent font-[var(--font-nunito)] text-sm text-[#101828] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-[var(--font-nunito)] text-lg font-bold text-[#101828]">
                Status
              </span>

              {statuses.map((status) => {
                const active = selectedStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-full border px-4 py-2 font-[var(--font-nunito)] text-sm font-semibold transition ${
                      active
                        ? "border-[#C12116] bg-[#FFECEC] text-[#C12116]"
                        : "border-[#D0D5DD] bg-white text-[#344054] hover:border-[#C12116]"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <div className="space-y-5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const total = order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  );

                  return (
                    <article
                      key={order.id}
                      className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#F2F4F7]">
                            <Image
                              src={order.restaurantImage}
                              alt={order.restaurant}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h2 className="font-[var(--font-nunito)] text-base font-bold text-[#101828]">
                              {order.restaurant}
                            </h2>
                            <p className="text-xs text-[#667085]">
                              Order ID: {order.id}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-[#F2F4F7] px-3 py-1 text-xs font-semibold text-[#475467]">
                          {order.status}
                        </span>
                      </div>

                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2F4F7]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-[var(--font-nunito)] text-base font-semibold text-[#101828]">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#667085]">
                              Qty: {item.quantity}
                            </p>
                            <p className="mt-1 font-[var(--font-nunito)] text-sm font-bold text-[#101828]">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="my-4 border-t border-[#EAECF0]" />

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-[var(--font-nunito)] text-sm text-[#667085]">
                            Total
                          </p>
                          <p className="font-[var(--font-nunito)] text-lg font-extrabold text-[#101828]">
                            {formatRupiah(total)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            alert(`Order ${order.id}: ${order.status}`)
                          }
                          className="min-h-12 w-full rounded-full bg-[#C12116] px-6 font-[var(--font-nunito)] text-base font-bold text-white transition hover:bg-[#A51C13] sm:w-[240px]"
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="py-12 text-center">
                  <p className="font-[var(--font-nunito)] text-base font-bold text-[#101828]">
                    No orders found
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">
                    Try another search keyword or status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
