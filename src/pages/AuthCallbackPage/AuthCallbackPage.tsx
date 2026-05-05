import { useEffect, useState } from "react";

import "./AuthCallbackPage.scss";

type CallbackStatus = "loading" | "error";

const AuthCallbackPage = () => {
  const [status, setStatus] = useState<CallbackStatus>("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken && window.opener) {
      window.opener.postMessage(
        { accessToken, refreshToken },
        import.meta.env.VITE_CLIENT_BASE_URL,
      );
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <div className="auth-callback">
      {status === "loading" && (
        <p className="auth-callback__text">Signing in...</p>
      )}
      {status === "error" && (
        <p className="auth-callback__text auth-callback__text--error">
          Something went wrong. Please close this window and try again.
        </p>
      )}
    </div>
  );
};

export default AuthCallbackPage;