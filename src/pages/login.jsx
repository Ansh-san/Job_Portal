import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // ← inline error instead of alert

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const result = login(email, password);

    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };


  return (
    <div className="login-page">
      <div className="login-card">
        {/* Badge / credentials panel */}
        <div className="login-panel">
          <div className="login-panel-texture" />
          <div className="login-panel-seam" />
          <div className="login-notch top" />
          <div className="login-notch bottom" />

          <div className="login-panel-content">
            <div className="login-brand-row">
              <div className="login-logo-badge">
                <BriefcaseBusiness size={22} color="#fff" />
              </div>
              <span className="login-brand-name">Job Portal</span>
            </div>

            <p className="login-eyebrow">Applicant Access</p>
            <h2 className="login-panel-heading">
              Your next role
              <br />
              starts with sign-in.
            </h2>
          </div>

          <div className="login-panel-footer">
            Credentials verified locally · No data leaves this device
          </div>
        </div>

        {/* Form panel */}
        <div className="login-form-panel">
          <div className="login-mobile-brand">
            <div className="login-logo-badge">
              <BriefcaseBusiness size={22} color="#fff" />
            </div>
            <span className="login-brand-name">Job Portal</span>
          </div>

          <div className="login-heading-block">
            <p className="login-eyebrow">Welcome back</p>
            <h1>Sign in to continue</h1>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {/* Email */}
            <div>
              <label className="login-field-label">Email Address</label>

              <div className="login-input-wrap">
                <Mail size={19} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="login-field-label">Password</label>

              <div className="login-input-wrap">
                <Lock size={19} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="login-row-between">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>

              <button
                onClick={handleForgotPassword}
                type="button"
                className="login-forgot-btn"
              >
                Forgot password?
              </button>
            </div>

            {/* Inline error message */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: "8px",
                padding: "0.6rem 0.9rem",
                color: "#f87171",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button type="submit" className="login-submit-btn">
              Sign in
            </button>


            {/* Divider */}
            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            {/* Google Button */}
            <button type="button" className="login-google-btn">
              Continue with Google
            </button>
          </form>

          <div className="login-footer-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="login-signup-btn"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;