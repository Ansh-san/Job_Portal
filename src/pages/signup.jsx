import React, { useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Job Seeker"); // ← fixed: wired to state

  const validate = () => {
    let errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!agree) errs.agree = "You must accept the Terms & Conditions";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = signup({ fullname: name, username, email, phone, password, role });

    if (!result.success) {
      setErrors((prev) => ({ ...prev, email: result.message }));
      return;
    }

    alert("Account Created Successfully! Please sign in.");
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Register to apply for your dream job.</p>
        </div>

        <form className="signup-form" onSubmit={handlesubmit}>
          <div className="row">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            <div className="input-group">
              <label>Username</label>
              <input
                value={username}
                type="text"
                placeholder="Choose username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                placeholder="9876543210"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                placeholder="Create password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* ← fixed: role radio buttons wired to state */}
          <div className="role-section">
            <label>Select Role</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Job Seeker"
                  checked={role === "Job Seeker"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Job Seeker
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={role === "Recruiter"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Recruiter
              </label>
            </div>
          </div>

          <div className="terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              &nbsp;I agree to the <a href="#">Terms &amp; Conditions</a>
            </span>
            {errors.agree && <p className="error">{errors.agree}</p>}
          </div>

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        {/* ← fixed: now navigates to login instead of unclickable span */}
        <p className="login-link">
          Already have an account?{" "}
          <span
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;