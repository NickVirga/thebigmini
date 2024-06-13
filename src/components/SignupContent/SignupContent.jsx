import "./SignupContent.scss";
import { useState } from "react";

import { FaCircleExclamation } from "react-icons/fa6";

function SignupContent() {
  const [emailInput, setEmailInput] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailErrorEnabled, setEmailErrorEnabled] = useState(false);
  const [emailAccepted, setEmailAccepted] = useState(false);

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordErrorEnabled, setPasswordErrorEnabled] = useState(false);
  const [passwordAccepted, setPasswordAccepted] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmailInput(emailValue);
    setEmailInvalid(!e.target.validity.valid);
    setEmailErrorEnabled(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailAccepted) {
      if (emailInvalid) {
        setEmailErrorEnabled(true);
      } else {
        setEmailAccepted(true);
      }
    } else {
      if (passwordIsValid(passwordInput)) {
        setPasswordAccepted(true);
      } else {
        setPasswordErrorEnabled(true);
      }
    }
  };

  const handleEditEmail = () => {
    setEmailAccepted(false);
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
            <div className="signup__error-wrapper">
              <FaCircleExclamation className="signup__error-icon"></FaCircleExclamation>
              <span className="signup__error-msg">
                Please enter a valid email address.
              </span>
            </div>
          )}
          {emailAccepted && (
            <button
              className={`signup__field-btn ${
                emailAccepted ? "signup__field-btn--disabled" : ""
              }`}
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
              <div className="signup__error-wrapper">
                <FaCircleExclamation className="signup__error-icon"></FaCircleExclamation>
                <span className="signup__error-msg">
                  {passwordErrorMessage}
                </span>
              </div>
            )}
            <button
              className="signup__field-btn"
              onClick={handleHideShowPassword}
            >
              {passwordHidden ? "Show" : "Hide"}
            </button>
          </div>
        )}

        {!passwordAccepted && <button className="signup__submit-btn" type="submit">
          Continue
        </button>}
      </form>
    </div>
  );
}

export default SignupContent;
