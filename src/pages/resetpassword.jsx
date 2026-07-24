import React, { useState } from "react";
import { Lock, Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Retrieve the email that was verified in the forgot password step
    const email = sessionStorage.getItem("jp_resetEmail");
    if (!email) {
      setError("Session expired. Please start the forgot password process again.");
      return;
    }

    const result = resetPassword(email, newPassword);
    if (!result.success) {
      setError(result.message);
      return;
    }

    sessionStorage.removeItem("jp_resetEmail");
    alert("Password Updated Successfully! Please sign in with your new password.");
    navigate("/");
  };


  return (
    <div className="reset-page">
      <div className="reset-card">
        <div className="reset-header">
          <div className="reset-logo">
            <BriefcaseBusiness size={28} color="white" />
          </div>

          <h1>Create New Password</h1>

          <p>
            Your new password must be different from your previous password.
          </p>
        </div>

        <form onSubmit={handleReset} className="reset-form">
          {/* New Password */}

          <div className="input-group">
            <label>New Password</label>

            <div className="password-input">
              <Lock size={20} />

              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div className="input-group">
            <label>Confirm Password</label>

            <div className="password-input">
              <Lock size={20} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

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

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;