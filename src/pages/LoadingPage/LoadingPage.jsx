import "./LoadingPage.scss";
import { useEffect } from "react";

function LoadingPage() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    console.log("useEffect")

    if (accessToken && refreshToken) {
        console.log("send tokens")
        console.log(accessToken)
        console.log(refreshToken)
      // Send the tokens to the parent window
      window.opener.postMessage(
        { accessToken, refreshToken },
        `${import.meta.env.VITE_CLIENT_BASE_URL}`
      );
      
    }
  }, []);

  return (
    <div className="loading__container">
      <div className="loading__spinner"></div>
    </div>
  );
}

export default LoadingPage;
