import React, { useState } from "react";
import { Mail, ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import users from "../data/users";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }
    const user = users.find((u) => u.email === email.trim());
    if (!user) {
      alert("user not found");
      return;
    }

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

          <button type="submit" className="forgot-btn" onClick={handleSubmit}>
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