import axiosInstance from "@/api/axios";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
} from "@/types/types";
import { clearTokens } from "@/utils/tokenManager";
import i18n from "@/i18n";

// Auth API functions

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const requestData = {
      email: data.email,
      password: data.password,
    };

    const response = await axiosInstance.post<LoginResponse>(
      `/auth/login`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": i18n.language,
          "Time-zone": "UTC",
        },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error.response.data.message);
    throw error;
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  clearTokens();
  return { success: true, message: "Logged out successfully" };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>(
    "/auth/refresh-token",
    { refreshToken } as RefreshTokenRequest,
    {
      headers: {
        "Accept-Language": i18n.language,
        "Time-zone": "UTC",
      },
    }
  );
  return response.data;
};
