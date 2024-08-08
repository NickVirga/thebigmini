import "./SignupContent.scss";
import { useState } from "react";
import axios from "axios";

import { FaCircleExclamation, FaCircleCheck } from "react-icons/fa6";

function SignupContent() {
  const [emailInput, setEmailInput] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(true);
  const [emailErrorEnabled, setEmailErrorEnabled] = useState(false);
  const [emailAccepted, setEmailAccepted] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordErrorEnabled, setPasswordErrorEnabled] = useState(false);
  const [passwordAccepted, setPasswordAccepted] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [submitMsgEnabled, setSubmitMsgEnabled] = useState(false);
  const [submitErrorEnabled, setSubmitErrorEnabled] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmailInput(emailValue);
    setEmailInvalid(!e.target.validity.valid);
    setEmailErrorEnabled(false);
    resetSubmitMsg();
  };

  const handleEditEmail = () => {
    setEmailAccepted(false);
    setPasswordAccepted(false);
    setPasswordInput("");
    setPasswordErrorEnabled(false);
    resetSubmitMsg();
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPasswordInput(passwordValue);
    setPasswordErrorEnabled(false);
  };

  const handleHideShowPassword = () => {
    setPasswordHidden(!passwordHidden);
  };

  const passwordIsValid = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordErrorMessage(
        `Password must be at least ${minLength} characters long.`
      );
      return false;
    }
    if (!hasUpperCase) {
      setPasswordErrorMessage(
        "Password must contain at least one uppercase letter."
      );
      return false;
    }
    if (!hasLowerCase) {
      setPasswordErrorMessage(
        "Password must contain at least one lowercase letter."
      );
      return false;
    }
    if (!hasNumber) {
      setPasswordErrorMessage("Password must contain at least one number.");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordErrorMessage(
        "Password must contain at least one special character."
      );
      return false;
    }

    setPasswordErrorMessage("");
    return true;
  };

  const resetSubmitMsg = () => {
    setSubmitMsgEnabled(false);
    setSubmitErrorEnabled(false);
    setSubmitMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (submitMsgEnabled) {
      resetSubmitMsg();
    } else {
      if (!emailAccepted) {
        if (emailInvalid) {
          setEmailErrorEnabled(true);
        } else {
          setEmailAccepted(true);
        }
      } else {
        if (passwordIsValid(passwordInput)) {
          const reqBody = { email: emailInput, password: passwordInput };
          sendSignup(reqBody);
          setPasswordAccepted(true);
        } else {
          setPasswordErrorEnabled(true);
        }
      }
    }
  };

  const sendSignup = async (reqBody) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/signup`,
        reqBody
      );
      setSubmitMsg(response.data.message);
      setSubmitMsgEnabled(true);
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || "Signup failed");
      setSubmitMsgEnabled(true);
      setSubmitErrorEnabled(true);
      setPasswordInput("");
      setEmailAccepted(false);
      setPasswordAccepted(false);
    }
  };

  return (
    <div className="signup">
      <h2 className="signup__title">Create a free account</h2>
      <form className="signup__form" onSubmit={handleSubmit} noValidate>
        <div
          className={`signup__fieldset ${
            emailAccepted ? "signup__fieldset--disabled" : ""
          }`}
        >
          <label className="signup__field-label" htmlFor="email">
            Email Address
          </label>
          <input
            className={`signup__field-input ${
              emailErrorEnabled ? "signup__field-input--error" : ""
            } ${emailAccepted ? "signup__field-input--disabled" : ""}`}
            value={emailInput}
            id="email"
            name="email"
            type="email"
            required
            maxLength="254"
            autoCapitalize="off"
            autoComplete="username"
            tabIndex="0"
            onChange={handleEmailChange}
            disabled={emailAccepted}
          ></input>
          {emailErrorEnabled && (
            <div className="signup__notification-wrapper signup__notification-wrapper--error">
              <FaCircleExclamation className="signup__notification-icon"></FaCircleExclamation>
              <span className="signup__notification-msg signup__notification-msg--error">
                Please enter a valid email address.
              </span>
            </div>
          )}
          {emailAccepted && (
            <button
              className={`signup__field-btn ${
                emailAccepted ? "signup__field-btn--disabled" : ""
              }`}
              type="button"
              onClick={handleEditEmail}
            >
              Edit
            </button>
          )}
        </div>
        {emailAccepted && (
          <div className="signup__fieldset">
            <label className="signup__field-label" htmlFor="password">
              Password
            </label>
            <input
              className={`signup__field-input ${
                emailErrorEnabled ? "signup__field-input--error" : ""
              }`}
              value={passwordInput}
              id="password"
              name="password"
              type={passwordHidden ? "password" : "text"}
              required
              autoCapitalize="off"
              autoComplete="password"
              onChange={handlePasswordChange}
            ></input>
            {passwordErrorEnabled && (
              <div className="signup__notification-wrapper signup__notification-wrapper--error">
                <FaCircleExclamation className="signup__notification-icon"></FaCircleExclamation>
                <span className="signup__notification-msg signup__notification-msg--error">
                  {passwordErrorMessage}
                </span>
              </div>
            )}
            <button
              className="signup__field-btn"
              type="button"
              onClick={handleHideShowPassword}
            >
              {passwordHidden ? "Show" : "Hide"}
            </button>
          </div>
        )}
        {submitMsgEnabled && (
          <div
            className={`signup__notification-wrapper ${
              submitErrorEnabled
                ? "signup__notification-wrapper--error"
                : "signup__notification-wrapper--success"
            }`}
          >
            {submitErrorEnabled && (
              <FaCircleExclamation className="signup__notification-icon signup__notification-icon--error"></FaCircleExclamation>
            )}
            {!submitErrorEnabled && (
              <FaCircleCheck className="signup__notification-icon signup__notification-icon--success"></FaCircleCheck>
            )}
            <span
              className={`signup__notification-msg ${
                submitErrorEnabled
                  ? "signup__notification-msg--error"
                  : "signup__notification-msg--success"
              }`}
            >
              {submitMsg}
            </span>
          </div>
        )}

        {!passwordAccepted && (
          <button className="signup__submit-btn" type="submit">
            Continue
          </button>
        )}
      </form>
    </div>
  );
}

export default SignupContent;
