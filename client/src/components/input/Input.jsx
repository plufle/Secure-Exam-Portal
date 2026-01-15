import "./Input.css";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function Input({ type, placeholder, label }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}

      <div className="input-wrapper">
        <input
          type={inputType}
          placeholder={placeholder}
          className="input"
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={handleShowPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;
