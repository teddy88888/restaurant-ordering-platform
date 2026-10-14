"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  MapPin,
  ClipboardList,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

export default function ProfileSidebar() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <aside className="w-full max-w-[228px] rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* User */}
      <div className="flex items-center gap-3 pb-5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-bold text-[#C12116]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <span className="truncate font-[var(--font-nunito)] text-base font-semibold text-[#0A0D12]">
          {user.name}
        </span>
      </div>

      <div className="border-t border-[#E5E5E5]" />

      {/* Navigation */}
      <nav className="mt-5 flex flex-col gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-1 py-2.5 font-[var(--font-nunito)] text-base text-[#0A0D12]"
        >
          <MapPin size={24} strokeWidth={1.8} />
          Delivery Address
        </Link>

        <Link
          href="/orders"
          className="flex items-center gap-3 rounded-xl px-1 py-2.5 font-[var(--font-nunito)] text-base text-[#0A0D12]"
        >
          <ClipboardList size={24} strokeWidth={1.8} />
          My Orders
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="flex items-center gap-3 rounded-xl px-1 py-2.5 text-left font-[var(--font-nunito)] text-base text-[#0A0D12]"
        >
          <LogOut size={24} strokeWidth={1.8} />
          Logout
        </button>
      </nav>
    </aside>
  );
}