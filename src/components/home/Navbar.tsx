"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, ClipboardList, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

type NavbarProps = {
  variant?: "home" | "inner";
};

export default function Navbar({ variant = "inner" }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="absolute left-0 top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[100px]">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Foody Home"
          className="flex shrink-0 items-center gap-[15px]"
        >
          <Image
            src={variant === "home" ? "/foody.png" : "/redfoody.png"}
            alt="Foody logo"
            width={42}
            height={42}
            priority
            className="h-[42px] w-[42px] object-contain"
          />

          <span
            className={`font-[var(--font-nunito)] text-[32px] font-bold leading-[42px] ${
              variant === "home" ? "text-white" : "text-[#0f0e0e]"
            }`}
          >
            Foody
          </span>
        </Link>

        {/* Authenticated user */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${
                variant === "home" ? "text-white" : "text-[#0A0D12]"
              }`}
            >
              <Image
                src={variant === "home" ? "/Bag.png" : "/blag.png"}
                alt="Shopping bag"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C12116] px-1 font-[var(--font-nunito)] text-xs font-bold leading-none text-white">
                1
              </span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((value) => !value)}
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
                className="flex h-12 items-center gap-3 text-white sm:gap-4"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-[var(--font-nunito)] text-lg text-[#C12116] ${
                      variant === "home" ? "bg-white" : "bg-[#eebcbc]"
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}

                <span
                  className={`hidden max-w-[140px] truncate font-[var(--font-nunito)] text-[18px] font-normal leading-8 tracking-[-0.02em] sm:inline ${
                    variant === "home" ? "text-white" : "text-[#0A0D12]"
                  }`}
                >
                  {user.name}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-14 z-[60] w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 text-gray-700 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-[var(--font-nunito)] text-sm font-semibold hover:bg-gray-50"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <Link
                    href="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-[var(--font-nunito)] text-sm font-semibold hover:bg-gray-50"
                  >
                    <ClipboardList size={18} />
                    Order History
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-[var(--font-nunito)] text-sm font-semibold text-[#C12116] hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className={`rounded-full border px-4 py-2.5 font-[var(--font-nunito)] text-sm font-semibold transition sm:px-6 sm:py-3 ${
                variant === "home"
                  ? "border-white text-white hover:bg-white/10"
                  : "border-[#0A0D12] text-[#0A0D12] hover:bg-gray-100"
              }`}
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-[#C12116] px-4 py-2.5 font-[var(--font-nunito)] text-sm font-semibold text-white transition hover:bg-[#a91c13] sm:px-6 sm:py-3"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
