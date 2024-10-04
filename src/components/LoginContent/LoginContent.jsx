import "./LoginContent.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { ModalContext } from "../../context/ModalContext";

import { FaGoogle, FaXTwitter, FaFacebookF } from "react-icons/fa6";

function LoginContent({ onClose }) {
  const { login, logout, accessToken } = useContext(AuthContext);
  const { updateModalMode, redirectMode, updateRedirectMode } =
    useContext(ModalContext);

  const sendLogin = async (response) => {
    try {
      await login({ idToken: response.credential });

      if (redirectMode === 3) {
        updateRedirectMode(null);
        updateModalMode(3);
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  const sendLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <div className="auth">
      <h2 className="auth__title">{`${
        accessToken
          ? "Log out of all devices:"
          : "Save your stats by signing in!"
      }`}</h2>
      {!accessToken && <GoogleLogin onSuccess={sendLogin} />}
      {/* {!accessToken && (
        <ul className="auth__login-list"> 
          <li className="auth__login-btn"> 
            <FaGoogle className="auth__btn-icon" onClick={sendLogin(0)} />
            Sign in with Google
          </li>
          <li className="auth__login-btn">
            <FaXTwitter className="auth__btn-icon" onClick={sendLogin(1)} />
            Sign in with X
          </li>
          <li className="auth__login-btn">
            <FaFacebookF className="auth__btn-icon" onClick={sendLogin(2)} />
            Sign in with Facebook
          </li>
        </ul>
      )} */}
      {accessToken && (
        <p className="auth__logout-btn button" onClick={sendLogout}>
          Logout
        </p>
      )}
    </div>
  );
}

export default LoginContent;
