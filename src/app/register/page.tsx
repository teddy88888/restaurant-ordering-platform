import Image from "next/image";
import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Image */}
        <div className="relative hidden min-h-screen lg:block">
          <Image
            src="/loginimage.png"
            alt="login image"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Form */}
        <div className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-[374px] font-[var(--font-nunito)]">
            {/* Logo */}
            <div className="mb-5 flex items-center gap-[15px]">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full  text-white">
                <img src="/redfoody.png" alt="Foody" />
              </div>

              <span className="text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
                Foody
              </span>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-[28px] font-extrabold leading-[38px] text-[#0A0D12]">
                Create Account
              </h1>

              <p className="text-base font-medium leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                Welcome! Let&apos;s create your account
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex h-14 w-full rounded-2xl bg-[#F5F5F5] p-2">
              <Link
                href="/login"
                className="flex flex-1 items-center justify-center rounded-xl px-3 text-base font-medium text-[#535862]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="flex flex-1 items-center justify-center rounded-xl bg-white px-3 text-base font-bold text-[#0A0D12] shadow-[0_0_20px_rgba(203,202,202,0.25)]"
              >
                Sign up
              </Link>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
