import "./LoginContent.scss";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";


function LoginContent() {
  const { updateModalMode } = useContext(ModalContext);




  return (
    <div className="login">
      <h2 className="login__title">Save your stats with a free account!</h2>
      <p className="login__create-btn button" onClick={() => {updateModalMode(5)}}>Create account</p>
      <p className="login__link" onClick={() => {updateModalMode(5)}}>Already Registed? Log In</p>
    </div>
  );
}

export default LoginContent;
