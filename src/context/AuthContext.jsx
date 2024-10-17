import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const storedTokens = JSON.parse(localStorage.getItem("authTokens")) || {};
  const [accessToken, setAccessToken] = useState(storedTokens.accessToken);
  const [refreshToken, setRefreshToken] = useState(storedTokens.refreshToken);

  const saveTokens = (tokens) => {
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  const logout = async () => {
    try {
      localStorage.removeItem("authTokens");
      setAccessToken(null);
      setRefreshToken(null);
      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/logout`,
        { refreshToken }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh-token`,
        { refreshToken }
      );
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      saveTokens({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      localStorage.removeItem("authTokens");
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await refreshAccessToken();
          originalRequest.headers["Authorization"] = `Bearer ${
            localStorage.getItem("authTokens")?.accessToken
          }`;
          return axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider value={{ saveTokens, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
