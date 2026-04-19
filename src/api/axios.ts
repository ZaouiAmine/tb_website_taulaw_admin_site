import axios from "axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import {
  getStoredTokens,
  storeTokens,
  clearTokens,
} from "@/utils/tokenManager";
import { refreshAccessToken } from "@/services/auth";
import i18n from "@/i18n";

function resolveApiBaseURL(): string {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (typeof v === "string" && v.trim() !== "") {
    return v.replace(/\/$/, "");
  }
  return "https://tyx9xuts0.gen.aventr.cloud";
}

const axiosInstance = axios.create({
  baseURL: resolveApiBaseURL(),
});

let isRefreshing = false;

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token has required fields
    if (!decoded.exp || !decoded.iat || !decoded.sub) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token is invalid or cannot be decoded:", error);
    return false;
  }
};

// handle token refresh
const handleTokenRefresh = async (): Promise<string | null> => {
  if (isRefreshing) {
    // If already refreshing, wait for it to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const tokens = getStoredTokens();
    return tokens?.accessToken || null;
  }

  isRefreshing = true;

  try {
    const tokens = getStoredTokens();
    if (!tokens?.refreshToken) {
      return null;
    }

    const refreshResponse = await refreshAccessToken(tokens.refreshToken);

    // Handle both response formats
    let newAccessToken: string | null = null;

    if (refreshResponse.success && refreshResponse.data?.accessToken) {
      // Format: { success: true, data: { accessToken: "..." } }
      newAccessToken = refreshResponse.data.accessToken;
    } else if (
      refreshResponse.code === 201 &&
      refreshResponse.response?.accessToken
    ) {
      // Format: { code: 201, response: { accessToken: "..." } }
      newAccessToken = refreshResponse.response.accessToken;
    } else if (
      refreshResponse.code === 201 &&
      refreshResponse.response?.token?.accessToken
    ) {
      // Format: { code: 201, response: { token: { accessToken: "..." } } }
      newAccessToken = refreshResponse.response.token.accessToken;
    }

    if (newAccessToken) {
      const newTokens = {
        ...tokens,
        accessToken: newAccessToken,
      };
      storeTokens(newTokens);

      return newAccessToken;
    } else {
      console.error(
        "Token refresh failed - invalid response format:",
        refreshResponse
      );
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  } finally {
    isRefreshing = false;
  }
};

// force user re-login
const forceReLogin = () => {
  clearTokens();
  window.dispatchEvent(new Event("localLogout"));
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // This is required header for end points
    config.headers["Accept-Language"] = i18n.language;
    config.headers["Time-zone"] = "UTC";

    const tokens = getStoredTokens();

    if (tokens?.accessToken) {
      // Check if token is valid (can be decoded)
      if (!isTokenValid(tokens.accessToken)) {
        console.error("Invalid token structure, forcing re-login");
        forceReLogin();
        return Promise.reject(new Error("Invalid token structure"));
      }

      // Check if token is expired
      if (isTokenExpired(tokens.accessToken)) {
        // Try to refresh the token
        const newToken = await handleTokenRefresh();

        if (newToken) {
          // Use the new token
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          console.error("Token refresh failed, forcing re-login");
          forceReLogin();
          return Promise.reject(new Error("Token refresh failed"));
        }
      } else {
        // Token is valid and not expired, use it
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    } else {
      // No access token found, proceeding without auth
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method?.toLowerCase() === "get") return response;

    // Success toast handling
    const successMessage =
      response.data?.message?.en ||
      response.data?.message ||
      response.data?.successMessage?.en ||
      response.data?.successMessage;

    if (successMessage) {
      toast.success(successMessage);
    }

    return response;
  },
  async (error) => {
    const { response, config } = error;

    if (!response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(new Error("Network Error"));
    }

    const originalRequest = config;

    // Handle 401 Unauthorized
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        // No refresh token, logout user
        forceReLogin();
        return Promise.reject(error);
      }

      try {
        const newToken = await handleTokenRefresh();

        if (newToken) {
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // Refresh failed, logout user
          forceReLogin();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        forceReLogin();
        return Promise.reject(refreshError);
      }
    }

    // Handle HTTPس
    switch (response.status) {
      case 400:
        toast.error(
          response.data.message?.en || response.data.message || "Bad request"
        );
        break;
      case 401:
        toast.error("Unauthorized. Please log in again.");
        break;
      case 403:
        toast.error(
          "Forbidden. You don't have permission to access this resource."
        );
        break;
      case 404:
        toast.error("Resource not found.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast.error(
          response.data?.message?.en ||
            response.data?.message ||
            "Something went wrong."
        );
    }

    return Promise.reject({
      message:
        response.data?.message?.en ||
        response.data?.message ||
        "Something went wrong",
      status: response.status,
      raw: error,
    });
  }
);

export default axiosInstance;
