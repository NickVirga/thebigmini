import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";

type AuthContextValue = {
  authTokens: AuthTokens | null;
  isLoading: boolean;
  saveTokens: (arg0: AuthTokens) => void;
  clearTokens: () => void;
  login: (arg0: string) => void;
  logout: () => void;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL;
const CLIENT_URL = import.meta.env.VITE_CLIENT_BASE_URL;

const AUTH_TOKEN_KEY = "bigmini-auth-tokens";

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getStoredTokens = (): AuthTokens | null => {
    try {
      const raw = localStorage.getItem(AUTH_TOKEN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(
    getStoredTokens(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveTokens = (tokens: AuthTokens) => {
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokens));
    setAuthTokens(tokens);
  };

  const clearTokens = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthTokens(null);
  };

  const login = async (endpoint: string) => {
    const url = `${SERVER_URL}${endpoint}`;
    const width = 450;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,status=no,scrollbars=yes`;
    const authWindow = window.open(url, "_blank", windowFeatures);

    // Monitor the window and handle communication
    const checkWindow = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkWindow);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);

    // Listen for a message from the child window (success with tokens)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === CLIENT_URL) {
        const { accessToken, refreshToken } = event.data;

        if (accessToken && refreshToken) {
          window.removeEventListener("message", handleMessage); // cleanup

          saveTokens({ accessToken, refreshToken });

          authWindow?.close();
        }
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const logout = async () => {
    try {
      const refreshToken = authTokens?.refreshToken;
      await axios.post(`${SERVER_URL}/api/auth/logout`, { refreshToken });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearTokens();
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = authTokens?.refreshToken;
      const response = await axios.post(
        `${SERVER_URL}/api/auth/refresh-token`,
        { refreshToken },
      );
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;
      saveTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      return newAccessToken;
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      clearTokens();
    }
  }, [authTokens]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{ authTokens, isLoading, saveTokens, clearTokens, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within a AuthProvider");
  return ctx;
};