
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { checkoutOrder } from "@/lib/api/order";

const DELIVERY_FEE = 10000;
const SERVICE_FEE = 1000;

const paymentMethods = [
  { id: "BNI", name: "BNI", description: "Bank Negara Indonesia" },
  { id: "BRI", name: "BRI", description: "Bank Rakyat Indonesia" },
  { id: "BCA", name: "BCA", description: "Bank Central Asia" },
  { id: "Mandiri", name: "Mandiri", description: "Bank Mandiri" },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const token = useAuthStore((state) => state.token);

  const [selectedBank, setSelectedBank] = useState("BNI");
  const [deliveryAddress, setDeliveryAddress] = useState(
    "Jl. Sudirman No. 25, Jakarta Pusat, 10220"
  );
  const [phone, setPhone] = useState("0812-3456-7890");
  const [notes, setNotes] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  useEffect(() => {
    if (items.length === 0) {
      // Keranjang kosong ditangani melalui tampilan di bawah.
    }
  }, [items.length]);

  const updateQuantity = (
    itemId: number,
    change: number
  ) => {
    const store = useCartStore.getState();
    const item = store.items.find((cartItem) => cartItem.id === itemId);

    if (!item) return;

    const nextQuantity = item.quantity + change;

    if (nextQuantity <= 0) {
      useCartStore.setState({
        items: store.items.filter(
          (cartItem) => cartItem.id !== itemId
        ),
      });
      return;
    }

    useCartStore.setState({
      items: store.items.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: nextQuantity }
          : cartItem
      ),
    });
  };

  const handlePay = async () => {
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Keranjang kamu masih kosong.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage("Silakan isi alamat pengantaran.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Silakan isi nomor telepon.");
      return;
    }

    if (!token) {
      setErrorMessage("Silakan login terlebih dahulu sebelum membayar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const restaurantsMap = new Map<
        number,
        { restaurantId: number; items: { menuId: number; quantity: number }[] }
      >();

      for (const item of items) {
        const restaurant = restaurantsMap.get(item.restaurantId);

        if (restaurant) {
          restaurant.items.push({
            menuId: item.id,
            quantity: item.quantity,
          });
        } else {
          restaurantsMap.set(item.restaurantId, {
            restaurantId: item.restaurantId,
            items: [
              {
                menuId: item.id,
                quantity: item.quantity,
              },
            ],
          });
        }
      }

      await checkoutOrder(
        {
          restaurants: Array.from(restaurantsMap.values()),
          deliveryAddress: deliveryAddress.trim(),
          phone: phone.trim(),
          paymentMethod: selectedBank,
          notes: notes.trim(),
        },
        token
      );

      // Simpan total sebelum keranjang dikosongkan.
      const paymentTotal = total;

      clearCart();

      router.push(
        `/payment-success?method=${encodeURIComponent(selectedBank)}&subtotal=${subtotal}`,
      );
    } catch (error) {
      console.error("Checkout error:", error);
      setErrorMessage(
        "Pesanan belum berhasil diproses. Silakan coba kembali."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="mt-20 mb-20 min-h-screen bg-[#F9FAFB] px-5 py-10 md:px-8">
        <div className="mx-auto w-full max-w-[1000px]">
          <h1 className="mb-8 font-[Nunito,sans-serif] text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
            Checkout
          </h1>

          {items.length === 0 ? (
            <section className="rounded-2xl border border-[#EAECF0] bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-extrabold text-[#0A0D12]">
                Keranjang kamu kosong
              </h2>
              <p className="mt-2 text-sm text-[#667085]">
                Pilih makanan terlebih dahulu sebelum checkout.
              </p>
              <Link
                href="/restaurants"
                className="mt-6 inline-flex rounded-lg bg-[#C12116] px-6 py-3 font-bold text-white transition hover:bg-[#A91D13]"
              >
                Lihat Restoran
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[590px_390px]">
              {/* Kolom kiri */}
              <div className="flex min-w-0 flex-col gap-6">
                {/* Delivery Address */}
                <section className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="font-[Nunito,sans-serif] text-xl font-extrabold text-[#0A0D12]">
                      Delivery Address
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        setIsEditingAddress((current) => !current)
                      }
                      className="shrink-0 rounded-lg border border-[#D0D5DD] px-4 py-2 text-sm font-bold text-[#344054] transition hover:bg-gray-50"
                    >
                      {isEditingAddress ? "Simpan" : "Edit"}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="deliveryAddress"
                          className="mb-2 block text-sm font-semibold text-[#344054]"
                        >
                          Alamat pengantaran
                        </label>
                        <textarea
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(event) =>
                            setDeliveryAddress(event.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm outline-none focus:border-[#C12116]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-semibold text-[#344054]"
                        >
                          Nomor telepon
                        </label>
                        <input
                          id="phone"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm outline-none focus:border-[#C12116]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEF3F2]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5 text-[#C12116]"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                          />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-[#0A0D12]">
                          Alamat Rumah
                        </p>
                        <p className="mt-1 break-words text-sm leading-6 text-[#667085]">
                          {deliveryAddress}
                        </p>
                        <p className="mt-2 text-sm text-[#667085]">
                          {phone}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* My Cart List */}
                <section className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 font-[Nunito,sans-serif] text-xl font-extrabold text-[#0A0D12]">
                    My Cart List
                  </h2>

                  <div className="mb-5 flex items-center gap-3 border-b border-[#EAECF0] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF3F2]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5 text-[#C12116]"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1m4 0h1m-6 4h1m4 0h1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-extrabold text-[#0A0D12]">
                        {items[0].restaurantName || "Restaurant"}
                      </p>
                      <p className="text-xs text-[#667085]">
                        {items.length} jenis menu
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 sm:gap-4"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F2F4F7]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.foodName}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[#667085]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-bold text-[#0A0D12]">
                            {item.foodName}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-[#C12116]">
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Kurangi ${item.foodName}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D0D5DD] text-lg text-[#344054] hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-[#0A0D12]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Tambah ${item.foodName}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D0D5DD] text-lg text-[#344054] hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-dashed border-[#D5D7DA] pt-5">
                    <label
                      htmlFor="notes"
                      className="mb-2 block text-sm font-bold text-[#344054]"
                    >
                      Catatan untuk restoran (opsional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Contoh: tidak pedas, saus dipisah..."
                      rows={2}
                      className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm outline-none focus:border-[#C12116]"
                    />
                  </div>
                </section>
              </div>

              {/* Kolom kanan */}
              <aside className="flex min-w-0 flex-col gap-6">
                {/* Payment Method */}
                <section className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-sm">
                  <h2 className="mb-5 font-[Nunito,sans-serif] text-xl font-extrabold text-[#0A0D12]">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const isSelected = selectedBank === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedBank(method.id)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-[#C12116] bg-[#FFF8F7]"
                              : "border-[#EAECF0] hover:border-[#D0D5DD]"
                          }`}
                        >
                          <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-[#EAECF0] bg-white text-xs font-extrabold text-[#344054]">
                            {method.id === "Mandiri" ? "MDR" : method.id}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#0A0D12]">
                              {method.name}
                            </p>
                            <p className="text-xs text-[#667085]">
                              {method.description}
                            </p>
                          </div>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#C12116] bg-[#C12116] text-white"
                                : "border-[#D0D5DD] bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="h-3 w-3"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4 10 4 4 8-8"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Payment Summary */}
                <section className="rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-sm">
                  <h2 className="mb-6 font-[Nunito,sans-serif] text-xl font-extrabold text-[#0A0D12]">
                    Payment Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm text-[#667085]">
                        Price ({itemCount} items)
                      </span>
                      <span className="text-right text-sm font-bold text-[#0A0D12]">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#667085]">
                        Delivery Fee
                      </span>
                      <span className="text-sm font-bold text-[#0A0D12]">
                        {formatRupiah(DELIVERY_FEE)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#667085]">
                        Service Fee
                      </span>
                      <span className="text-sm font-bold text-[#0A0D12]">
                        {formatRupiah(SERVICE_FEE)}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-dashed border-[#D5D7DA]" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-extrabold text-[#0A0D12]">
                      Total
                    </span>
                    <span className="text-xl font-extrabold text-[#C12116]">
                      {formatRupiah(total)}
                    </span>
                  </div>

                  {errorMessage && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isSubmitting || items.length === 0}
                    className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#C12116] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#A91D13] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Memproses..." : "Pay"}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-[#667085]">
                    Dengan menekan Pay, kamu melanjutkan pemesanan dengan
                    metode pembayaran yang dipilih.
                  </p>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}