import "./LoginContent.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { ModalContext } from "../../context/ModalContext";

function LoginContent({ onClose }) {
  const { login, logout, accessToken } = useContext(AuthContext);
  const { updateModalMode, redirectMode, updateRedirectMode } = useContext(ModalContext);

  const sendLogin = async (response) => {
    try {
      await login({ idToken: response.credential })

      if (redirectMode === 3) {
        updateRedirectMode(null)
        updateModalMode(3)
      } else {
        onClose()
      }
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  const sendLogout = async () => {
    try {
      await logout()
    } catch(err) {
      console.error('Failed to logout:', err);
    }
  }


  return (
    <div className="login">
      <h2 className="login__title">{`${accessToken ? 'Log out of all devices:' : 'Save your stats by signing in!'}`}</h2>
      {!accessToken && <GoogleLogin
        onSuccess={sendLogin}
      />}
      {accessToken && <p className="login__logout-btn button" onClick={sendLogout}>Logout</p>}
    </div>
  );
}

export default LoginContent;
