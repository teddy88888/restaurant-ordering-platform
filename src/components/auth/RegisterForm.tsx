"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";

import { registerUser } from "@/lib/api/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      console.log("Register success:", response);

      login(response.data.token, response.data.user);

window.location.href = "/";
    } catch (error) {
      console.error("Register error:", error);

      setApiError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 font-[var(--font-nunito)]"
    >
      {/* Name */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-14 w-full items-center rounded-xl border bg-white px-3 ${
            errors.name ? "border-[#C12116]" : "border-[#D5D7DA]"
          }`}
        >
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="h-full w-full bg-transparent text-base font-normal tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680]"
          />
        </div>

        {errors.name && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.name.message}
          </p>
        )}
      </div>

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

      {/* Phone Number */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-14 w-full items-center rounded-xl border bg-white px-3 ${
            errors.phone ? "border-[#C12116]" : "border-[#D5D7DA]"
          }`}
        >
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Phone Number"
            {...register("phone")}
            className="h-full w-full bg-transparent text-base font-normal tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680]"
          />
        </div>

        {errors.phone && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.phone.message}
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

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex h-14 w-full items-center rounded-xl border bg-white px-3 ${
            errors.confirmPassword ? "border-[#C12116]" : "border-[#D5D7DA]"
          }`}
        >
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="h-full w-full bg-transparent text-base font-normal tracking-[-0.02em] text-[#0A0D12] outline-none placeholder:text-[#717680]"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center text-[#0A0D12]"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Agreement */}
      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            {...register("agree")}
            className="mt-1 h-5 w-5 shrink-0 rounded-md border border-[#D5D7DA] accent-[#C12116]"
          />

          <span className="text-base font-medium leading-[30px] tracking-[-0.03em] text-[#0A0D12]">
            I agree to the Terms and Conditions
          </span>
        </label>

        {errors.agree && (
          <p className="text-sm font-semibold leading-7 tracking-[-0.02em] text-[#C12116]">
            {errors.agree.message}
          </p>
        )}
      </div>

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
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}
