import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left image */}
        <div className="hidden min-h-screen bg-[#2b0b08] lg:block">
          <Image
            src="/loginimage.png"
            alt="login"
            width={600}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right content */}
        <div className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-[374px]">
            {/* Logo */}
            <div className="mb-5 flex items-center gap-[15px]">
              <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full text-white">
                <Image
                  src="/redfoody.png"
                  alt="redfoody"
                  width={42}
                  height={42}
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="font-sans text-[32px] font-extrabold leading-[42px] text-[#0A0D12]">
                Foody
              </span>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <h1 className="font-sans text-[28px] font-extrabold leading-[38px] text-[#0A0D12]">
                Welcome Back
              </h1>

              <p className="font-sans text-base font-medium leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
                Good to see you again! Let&apos;s eat
              </p>
            </div>

            {/* Auth switch */}
            <div className="mb-5 flex h-14 w-full rounded-2xl bg-[#F5F5F5] p-2">
              <Link
                href="/login"
                className="flex flex-1 items-center justify-center rounded-xl bg-white px-3 text-base font-bold text-[#0A0D12] shadow-[0_0_20px_rgba(203,202,202,0.25)]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="flex flex-1 items-center justify-center rounded-xl px-3 text-base font-medium text-[#535862]"
              >
                Sign up
              </Link>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
