"use client";

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      console.log("Login success:", response);

      login(response.data.token, response.data.user);

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);

      setApiError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 font-[var(--font-nunito)]"
    >
      {/* Email */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-14 w-full items-center rounded-xl border bg-white px-3 ${
            errors.email ? "border-[#C12116]" : "border-[#D5D7DA]"
          }`}
        >
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="h-full w-full bg-transparent text-base font-normal tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680]"
          />
        </div>

        {errors.email && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-14 w-full items-center rounded-xl border bg-white px-3 ${
            errors.password ? "border-[#C12116]" : "border-[#D5D7DA]"
          }`}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="h-full w-full bg-transparent text-base font-normal tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center text-[#0A0D12]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          {...register("rememberMe")}
          className="h-5 w-5 appearance-none rounded-md border border-[#D5D7DA] checked:bg-[#C12116]"
        />

        <span className="text-base font-medium leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
          Remember Me
        </span>
      </label>

      {/* API Error */}
      {apiError && (
        <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
          {apiError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-[#C12116] px-2 text-base font-bold leading-[30px] tracking-[-0.02em] text-[#FDFDFD] transition hover:bg-[#a91c13] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
