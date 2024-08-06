import "./LoginContent.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';

function LoginContent() {
  const { loggedIn, updateLoggedIn } = useContext(AuthContext);


  const sendLogin = async (response) => {
    const reqBody = { idToken: response.credential }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/login/google`,
        reqBody
      );
      const { accessToken, refreshToken } = response.data
      localStorage.setItem("authTokens", JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }))
      updateLoggedIn(true)
    } catch (err) {
      console.error(err)
    }
  };

  const sendLogout = async () => {
      const storedAuthTokenString = localStorage.getItem("authTokens")
      const { refreshToken } = JSON.parse(storedAuthTokenString)
      const reqBody = { refreshToken: refreshToken}
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/logout`,
        reqBody
      );
      localStorage.removeItem("authTokens")
      updateLoggedIn(false)
    } catch(err) {
      console.error(err)
    }
  }


  return (
    <div className="login">
      <h2 className="login__title">{`${loggedIn ? 'Log out of all devices:' : 'Save your stats by signing in!'}`}</h2>
      {!loggedIn && <GoogleLogin
        onSuccess={sendLogin}
      />}
      {loggedIn && <p className="login__create-btn button" onClick={sendLogout}>Logout</p>}
    </div>
  );
}

export default LoginContent;
