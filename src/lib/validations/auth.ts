import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers")
      .min(10, "Phone number must be at least 10 digits"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm password is required"),

    agree: z.boolean().refine((value) => value, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;