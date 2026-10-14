"use client";

import Image from "next/image";

import { useAuthStore } from "@/store/authStore";

export default function ProfileCard() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-[500px] rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Avatar */}
      <div className="relative mb-5 h-16 w-16 overflow-hidden rounded-full bg-gray-100">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#C12116]">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex items-center justify-between py-2">
        <span className="font-[var(--font-nunito)] text-base text-[#0A0D12]">
          Name
        </span>

        <span className="font-[var(--font-nunito)] text-base font-bold text-[#0A0D12]">
          {user.name}
        </span>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between py-2">
        <span className="font-[var(--font-nunito)] text-base text-[#0A0D12]">
          Email
        </span>

        <span className="font-[var(--font-nunito)] text-base font-bold text-[#0A0D12]">
          {user.email}
        </span>
      </div>

      {/* Phone */}
      <div className="flex items-center justify-between py-2">
        <span className="font-[var(--font-nunito)] text-base text-[#0A0D12]">
          Nomor Handphone
        </span>

        <span className="font-[var(--font-nunito)] text-base font-bold text-[#0A0D12]">
          {user.phone}
        </span>
      </div>

      {/* Update */}
      <button
        type="button"
        className="mt-5 h-11 w-full rounded-full bg-[#C12116] font-[var(--font-nunito)] text-base font-bold text-white transition hover:bg-[#A91C13]"
      >
        Update Profile
      </button>
    </div>
  );
}
