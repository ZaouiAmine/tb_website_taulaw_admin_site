import { encryptValue, encryptKey, decryptValue } from "@/lib/encryption";
import type { AuthTokens } from "@/types/types";

// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Token management functions
export const getStoredTokens = (): AuthTokens | null => {
  try {
    const accessToken = localStorage.getItem(encryptKey(ACCESS_TOKEN_KEY));
    const refreshToken = localStorage.getItem(encryptKey(REFRESH_TOKEN_KEY));

    if (!accessToken || !refreshToken) return null;

    return {
      accessToken: decryptValue(accessToken),
      refreshToken: decryptValue(refreshToken),
    };
  } catch (error) {
    console.error("Error with stored tokens:", error);
    return null;
  }
};

export const storeTokens = (tokens: AuthTokens): void => {
  try {
    const encryptedAccessToken = encryptValue(tokens.accessToken);
    const encryptedRefreshToken = encryptValue(tokens.refreshToken);

    localStorage.setItem(encryptKey(ACCESS_TOKEN_KEY), encryptedAccessToken);
    localStorage.setItem(encryptKey(REFRESH_TOKEN_KEY), encryptedRefreshToken);
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

export const clearTokens = (): void => {
  try {
    localStorage.removeItem(encryptKey(ACCESS_TOKEN_KEY));
    localStorage.removeItem(encryptKey(REFRESH_TOKEN_KEY));
    localStorage.removeItem(encryptKey(USER_KEY));
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(encryptKey(USER_KEY));
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting stored user:", error);
    return null;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeUser = (user: any): void => {
  try {
    localStorage.setItem(encryptKey(USER_KEY), JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch (error) {
    console.error("Error getting token expiration time:", error);
    return null;
  }
};
