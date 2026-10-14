"use client";

import { useState } from "react";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, comment: string) => void;
  restaurantName?: string;
}

export default function ReviewModal({
  open,
  onClose,
  onSubmit,
  restaurantName,
}: ReviewModalProps) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  if (!open) return null;

  function handleSubmit() {
    if (rating < 1) return;

    onSubmit?.(rating, comment);
    onClose();
    setRating(4);
    setComment("");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="flex max-h-[calc(100dvh-32px)] w-full max-w-[439px] flex-col items-center gap-6 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <header className="flex w-full items-center justify-between">
          <h2
            id="review-title"
            className="font-[var(--font-nunito)] text-2xl font-extrabold leading-9 text-[#0A0D12]"
          >
            Give Review
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#0A0D12] transition hover:bg-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex w-full flex-col items-center">
          <p className="text-center font-[var(--font-nunito)] text-base font-extrabold leading-[30px] text-[#0A0D12]">
            Give Rating
          </p>

          {restaurantName && (
            <p className="mt-1 text-center text-sm text-[#717680]">
              {restaurantName}
            </p>
          )}

          <div
            className="mt-1 flex h-[49px] items-center justify-center gap-1"
            role="group"
            aria-label="Choose rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
                onClick={() => setRating(star)}
                className="flex h-[49px] w-[49px] items-center justify-center transition hover:scale-110"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10"
                  fill={star <= rating ? "#FDB022" : "#A4A7AE"}
                  aria-hidden="true"
                >
                  <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96L12 2.5Z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Write your review here..."
          aria-label="Your review"
          className="h-[235px] w-full resize-none rounded-xl border border-[#D5D7DA] p-3 font-[var(--font-nunito)] text-base leading-[30px] tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680] focus:border-[#C12116] focus:ring-1 focus:ring-[#C12116]"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="flex h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#C12116] px-4 font-[var(--font-nunito)] text-base font-bold text-white transition hover:bg-[#A51C13]"
        >
          Submit
        </button>
      </section>
    </div>
  );
}
