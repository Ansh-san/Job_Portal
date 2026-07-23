import React from "react";
import "./signup.css";
import { useState } from "react";
import users from "../data/users.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");

  const validate = () => {
    let errors = {};
    if (!name.trim()) {
      errors.name = "Name is required ";
    }
    if (!email) {
      errors.email = "Email is required";
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!agree) {
      errors.agree = "Accept Terms";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const newUser = {
        id: users.length + 1,
        fullname: name,
        username: username,
        email: email,
        phone: phone,
        password: password,
        role: "Job Seeker",
      };

      users.push(newUser);

      console.log(users);

      alert("Account Created Successfully!");
      navigate("/");
    }
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
                placeholder="Create password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="role-section">
            <label>Select Role</label>

            <div className="role-options">
              <label>
                <input type="radio" name="role" />
                Job Seeker
              </label>

              <label>
                <input type="radio" name="role" />
                Recruiter
              </label>
            </div>
          </div>

          <div className="terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
              }}
            />
            {errors.agree && <p className="error">{errors.agree}</p>}

            <span>
              I agree to the <a href="# ">Terms & Conditions</a>
            </span>
          </div>

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        <p className="login-link">
          Already have an account?
          <span> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;