import React from "react";
import { BriefcaseBusiness, LogOut, LayoutDashboard, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Generate initials from the user's name
  const initials = currentUser?.fullname
    ? currentUser.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
          <div className="navbar-logo-badge">
            <BriefcaseBusiness size={18} color="#fff" />
          </div>
          <span className="navbar-brand-name">Job Portal</span>
        </div>

        {/* Nav Links */}
        <div className="navbar-links">
          <button
            className={`navbar-link ${location.pathname === "/home" ? "navbar-link-active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <Home size={15} /> Jobs
          </button>
          <button
            className={`navbar-link ${location.pathname === "/dashboard" ? "navbar-link-active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={15} /> Dashboard
          </button>
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {/* User pill */}
          {currentUser && (
            <div className="navbar-user-pill">
              <div className="navbar-avatar">{initials}</div>
              <div className="navbar-user-info">
                <span className="navbar-user-name">
                  {currentUser.fullname || currentUser.email}
                </span>
                <span className="navbar-user-role">
                  {currentUser.role || "Job Seeker"}
                </span>
              </div>
            </div>
          )}

          {/* Logout */}
          <button className="navbar-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
