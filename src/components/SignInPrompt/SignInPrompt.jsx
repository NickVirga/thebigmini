import "./SignInPrompt.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";

function SignInPrompt({ promptText }) {
  const { accessToken } = useContext(AuthContext);
  const { updateModalMode, updateRedirectMode } = useContext(ModalContext);

  const handleSignIn = () => {
    updateRedirectMode(3);
    updateModalMode(4);
  };

  return (
    <>
      {!accessToken && (
        <div className="stats__section">
          <p className="stats__signin-text" onClick={handleSignIn}>
            {promptText}
          </p>
        </div>
      )}
    </>
  );
}

export default SignInPrompt;
