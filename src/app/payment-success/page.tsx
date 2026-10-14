"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const DELIVERY_FEE = 10_000;
const SERVICE_FEE = 1_000;

const bankNames: Record<string, string> = {
  BNI: "Bank Negara Indonesia",
  BRI: "Bank Rakyat Indonesia",
  BCA: "Bank Central Asia",
  Mandiri: "Bank Mandiri",
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentSuccessPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BNI");
  const [subtotal, setSubtotal] = useState(0);
  const [transactionDate, setTransactionDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const method = params.get("method") || "BNI";
    const amountParam = params.get("subtotal");
    const amount = Number(amountParam);

    setPaymentMethod(
      Object.prototype.hasOwnProperty.call(bankNames, method) ? method : "BNI",
    );

    setSubtotal(
      amountParam !== null &&
        amountParam.trim() !== "" &&
        Number.isFinite(amount) &&
        amount >= 0
        ? amount
        : 0,
    );

    setTransactionDate(
      new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );

    setIsMounted(true);
  }, []);

  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  return (
    <>
      <Navbar />

      <main className="min-h-[75vh] bg-[#F9FAFB] px-4 py-12">
        <div className="mx-auto flex w-full max-w-[428px] flex-col items-center gap-7">
          {/* Foody Logo */}
          <Link
            href="/"
            aria-label="Foody - Home"
            className="flex items-center gap-[15px]"
          >
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#C12116] text-2xl font-extrabold text-white">
              F
            </span>
            <span className="font-[Nunito,sans-serif] text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
              Foody
            </span>
          </Link>

          {/* Success Card */}
          <section className="relative w-full rounded-2xl bg-white p-6 shadow-[0_0_20px_rgba(203,202,202,0.25)]">
            {/* Success Icon */}
            <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#44AB09]/10">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="h-16 w-16"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="27" fill="#44AB09" />
                <path
                  d="m19 32 9 9 18-19"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-center font-[Nunito,sans-serif] text-2xl font-extrabold text-[#0A0D12]">
              Payment Success
            </h1>

            <p className="mt-2 text-center text-sm leading-6 text-[#667085]">
              Your payment has been successfully processed.
            </p>

            {/* Transaction Details */}
            <div className="mt-7 space-y-4 border-b border-dashed border-[#D5D7DA] pb-6 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#667085]">Date</span>
                <span className="text-right font-bold text-[#0A0D12]">
                  {isMounted ? transactionDate : "\u00A0"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-[#667085]">Payment Method</span>
                <span className="text-right font-bold text-[#0A0D12]">
                  {bankNames[paymentMethod]}
                </span>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#667085]">Price</span>
                <span className="text-right font-bold text-[#0A0D12]">
                  {isMounted ? formatRupiah(subtotal) : "\u00A0"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#667085]">Delivery Fee</span>
                <span className="text-right font-bold text-[#0A0D12]">
                  {formatRupiah(DELIVERY_FEE)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-[#667085]">Service Fee</span>
                <span className="text-right font-bold text-[#0A0D12]">
                  {formatRupiah(SERVICE_FEE)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-dashed border-[#D5D7DA] pt-5">
              <span className="font-extrabold text-[#0A0D12]">Total</span>
              <span className="text-right text-xl font-extrabold text-[#C12116]">
                {isMounted ? formatRupiah(total) : "\u00A0"}
              </span>
            </div>

            {/* Back to Home */}
            <Link
              href="/"
              className="mt-7 flex w-full items-center justify-center rounded-lg bg-[#C12116] px-6 py-3.5 font-extrabold text-white transition hover:bg-[#A91D13]"
            >
              Back to Home
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
