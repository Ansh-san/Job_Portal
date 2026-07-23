import React, { useState } from "react";
import { Lock, Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();

    // Validation will come later
    alert("Password Updated Successfully!");

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

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;