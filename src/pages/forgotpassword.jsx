import React, { useState } from "react";
import { Mail, ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { emailExists } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!emailExists(email)) {
      setError("No account found with this email address.");
      return;
    }

    // Store the verified email so resetpassword page knows which user to update
    sessionStorage.setItem("jp_resetEmail", email.trim());
    alert("Email verified. Continue to reset password.");
    navigate("/resetpassword");
  };


  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="forgot-logo">
            <BriefcaseBusiness size={28} color="white" />
          </div>

          <h1>Forgot Password</h1>

          <p>Enter your registered email address to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-form">
          <label>Email Address</label>

          <div className="forgot-input">
            <Mail size={20} />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.85rem", margin: "0.25rem 0" }}>
              {error}
            </p>
          )}

          <button type="submit" className="forgot-btn">
            Continue
          </button>
        </form>


        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;