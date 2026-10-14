"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ReviewModal from "@/components/orders/ReviewModal";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useAuthStore } from "@/store/authStore";
import { getMyOrders, type MyOrder, type OrderStatus } from "@/lib/api/order";

type StatusFilter = "All" | OrderStatus;

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "All" },
  { label: "Preparing", value: "preparing" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Completed", value: "done" },
  { label: "Cancelled", value: "cancelled" },
];

const statusLabels: Record<OrderStatus, string> = {
  preparing: "Preparing",
  on_the_way: "On the Way",
  delivered: "Delivered",
  done: "Completed",
  cancelled: "Cancelled",
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u00a0/g, " ");

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

async function fetchAllOrders(token: string): Promise<MyOrder[]> {
  const statuses: OrderStatus[] = [
    "preparing",
    "on_the_way",
    "delivered",
    "done",
    "cancelled",
  ];

  const results = await Promise.all(
    statuses.map(async (status) => {
      const firstPage = await getMyOrders(token, status, 1, 10);
      const orders = [...firstPage.data.orders];
      const totalPages = firstPage.data.pagination.totalPages;

      for (let page = 2; page <= totalPages; page++) {
        const response = await getMyOrders(token, status, page, 10);
        orders.push(...response.data.orders);
      }

      return orders;
    }),
  );

  const uniqueOrders = new Map<number, MyOrder>();

  results.flat().forEach((order) => {
    uniqueOrders.set(order.id, order);
  });

  return [...uniqueOrders.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export default function MyOrdersPage() {
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRestaurant, setReviewRestaurant] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!token) {
      setOrders([]);
      setError("Silakan login terlebih dahulu untuk melihat pesanan.");
      setLoading(false);
      return;
    }

    try {
      const result =
        selectedStatus === "All"
          ? await fetchAllOrders(token)
          : (await getMyOrders(token, selectedStatus, 1, 10)).data.orders;

      setOrders(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data pesanan.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, selectedStatus]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");

      if (!token) {
        setOrders([]);
        setError("Silakan login terlebih dahulu untuk melihat pesanan.");
        setLoading(false);
        return;
      }

      try {
        const result =
          selectedStatus === "All"
            ? await fetchAllOrders(token)
            : (await getMyOrders(token, selectedStatus, 1, 10)).data.orders;

        if (!cancelled) {
          setOrders(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data pesanan.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, selectedStatus, reloadKey]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (!keyword) return true;

      return (
        order.transactionId.toLowerCase().includes(keyword) ||
        order.restaurants.some(
          ({ restaurant, items }) =>
            restaurant.name.toLowerCase().includes(keyword) ||
            items.some((item) => item.menuName.toLowerCase().includes(keyword)),
        )
      );
    });
  }, [orders, search]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main className="mt-20 mb-20 min-h-screen bg-[#FAFAFA]">
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

                {statusFilters.map((status) => {
                  const active = selectedStatus === status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setSelectedStatus(status.value)}
                      className={`rounded-full border px-4 py-2 font-[var(--font-nunito)] text-sm font-semibold transition ${
                        active
                          ? "border-[#C12116] bg-[#FFECEC] text-[#C12116]"
                          : "border-[#D0D5DD] bg-white text-[#344054] hover:border-[#C12116]"
                      }`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="py-16 text-center text-sm text-[#667085]">
                  Memuat pesanan...
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="font-semibold text-[#C12116]">{error}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((key) => key + 1)}
                    className="mt-3 text-sm font-semibold text-[#C12116] underline"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-[var(--font-nunito)] text-base font-bold text-[#101828]">
                    No orders found
                  </p>
                  <p className="mt-2 text-sm text-[#667085]">
                    Belum ada pesanan yang cocok dengan pencarian atau status
                    ini.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredOrders.map((order) => {
                    const expanded = expandedOrder === order.id;

                    return (
                      <article
                        key={order.id}
                        className="rounded-2xl border border-[#EAECF0] bg-white p-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h2 className="font-[var(--font-nunito)] text-base font-bold text-[#101828]">
                              Order #{order.transactionId}
                            </h2>
                            <p className="mt-1 text-xs text-[#667085]">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span className="rounded-full bg-[#F2F4F7] px-3 py-1 text-xs font-semibold text-[#475467]">
                            {statusLabels[order.status]}
                          </span>
                        </div>

                        <div className="space-y-5">
                          {order.restaurants.map((group) => (
                            <div
                              key={group.restaurant.id}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F2F4F7]">
                                  {group.restaurant.logo ? (
                                    <img
                                      src={group.restaurant.logo}
                                      alt={group.restaurant.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span aria-hidden="true">🍽️</span>
                                  )}
                                </div>

                                <h3 className="font-[var(--font-nunito)] text-base font-bold text-[#101828]">
                                  {group.restaurant.name}
                                </h3>
                              </div>

                              {group.items.map((item, index) => (
                                <div
                                  key={`${item.menuId}-${index}`}
                                  className="flex items-center gap-4"
                                >
                                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F2F4F7]">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.menuName}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span aria-hidden="true">🍽️</span>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-[var(--font-nunito)] text-base font-semibold text-[#101828]">
                                      {item.menuName}
                                    </h4>
                                    <p className="mt-1 text-sm text-[#667085]">
                                      Qty: {item.quantity}
                                    </p>
                                    <p className="mt-1 font-[var(--font-nunito)] text-sm font-bold text-[#101828]">
                                      {formatRupiah(item.price)}
                                    </p>
                                  </div>

                                  <p className="text-sm font-semibold text-[#101828]">
                                    {formatRupiah(item.itemTotal)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                        <div className="my-4 border-t border-[#EAECF0]" />

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-[var(--font-nunito)] text-sm text-[#667085]">
                              Total
                            </p>
                            <p className="font-[var(--font-nunito)] text-lg font-extrabold text-[#101828]">
                              {formatRupiah(order.pricing.totalPrice)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {order.status === "done" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewRestaurant(
                                    order.restaurants[0]?.restaurant.name ??
                                      "Restaurant",
                                  );
                                  setReviewOpen(true);
                                }}
                                className="min-h-12 rounded-full border border-[#C12116] px-6 font-[var(--font-nunito)] text-base font-bold text-[#C12116] transition hover:bg-[#FFECEC]"
                              >
                                Review
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrder(expanded ? null : order.id)
                              }
                              className="min-h-12 w-full rounded-full bg-[#C12116] px-6 font-[var(--font-nunito)] text-base font-bold text-white transition hover:bg-[#A51C13] sm:w-[200px]"
                            >
                              {expanded ? "Hide Details" : "View Details"}
                            </button>
                          </div>
                        </div>

                        {expanded && (
                          <div className="mt-5 space-y-2 rounded-xl bg-[#FAFAFA] p-4 text-sm text-[#475467]">
                            <p>
                              <strong>Transaction ID:</strong>{" "}
                              {order.transactionId}
                            </p>
                            <p>
                              <strong>Payment:</strong> {order.paymentMethod}
                            </p>
                            <p>
                              <strong>Phone:</strong> {order.phone}
                            </p>
                            <p>
                              <strong>Delivery address:</strong>{" "}
                              {order.deliveryAddress}
                            </p>

                            <div className="border-t border-[#EAECF0] pt-3">
                              <p>
                                Subtotal: {formatRupiah(order.pricing.subtotal)}
                              </p>
                              <p>
                                Service fee:{" "}
                                {formatRupiah(order.pricing.serviceFee)}
                              </p>
                              <p>
                                Delivery fee:{" "}
                                {formatRupiah(order.pricing.deliveryFee)}
                              </p>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        restaurantName={reviewRestaurant}
        onSubmit={(rating, comment) => {
          console.log("Review:", {
            restaurant: reviewRestaurant,
            rating,
            comment,
          });
        }}
      />
    </div>
  );
}
