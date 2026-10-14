import { api } from "./axios";

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      avatar: string;
      latitude: number;
      longitude: number;
      createdAt: string;
    };
    token: string;
  };
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/api/auth/register", data);

  return response.data;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginUser(data: LoginRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/api/auth/login", data);

  return response.data;
}