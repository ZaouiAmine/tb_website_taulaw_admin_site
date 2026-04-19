import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type {
  AuthContextType,
  LoginRequest,
  User,
  LoginResponse,
} from "@/types/types";
import {
  login,
} from "@/services/auth";
import {
  getStoredUser,
  storeUser,
  storeTokens,
  clearTokens,
} from "@/utils/tokenManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing user
  // on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Log-out
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    };

    window.addEventListener("localLogout", handleLogout);
    return () => window.removeEventListener("localLogout", handleLogout);
  }, [navigate]);

  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);

      const response: LoginResponse = await login(credentials);

      // console.log("Response data:", response.response);

      const payload = response.response ?? response.data;
      const isLoginSuccess =
        (response.code === 201 && !!response.response) ||
        (response.success === true && !!response.data);

      if (isLoginSuccess && payload) {
        // Extract user data
        const userData = {
          id: payload.user?.id || "admin_1",
          email: payload.user?.email || credentials.email,
          name: payload.user?.name || "Admin",
          role: payload.user?.role || "admin",
        };

        // Extract tokens
        const tokens = {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        };



        // Check if we have valid tokens
        if (!tokens || !tokens.accessToken) {
          console.error("token faild");
          throw new Error("no token recived");
        }

        // Store tokens and user data
        storeTokens(tokens);
        storeUser(userData);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // console.log("login successful ");

        // Show success message
        toast.success("Login successful!");

        // Redirect to home page
        navigate("/");
      } else {
        console.error("Login failed:", response);
        throw new Error("Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error ==>", error.response?.data?.message);
      console.error("Error details: ==>", {
        message: error.message,
        response: error.response,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message
          ?.toString()
          .replace("auth.", "")
          .replaceAll("_", " ") || error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
