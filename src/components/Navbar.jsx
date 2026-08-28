import React from "react";
import { BriefcaseBusiness, LogOut, LayoutDashboard, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = () => {
    if (!currentUser) return "U";
    const name = currentUser.name || currentUser.fullname || currentUser.email;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-sm shadow-primary-500/20">
              <BriefcaseBusiness size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-200">
              Job<span className="text-primary-600">Portal</span>
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex gap-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === "/" ? "bg-primary-50 text-primary-700" : "text-slate-400 hover:bg-slate-700 hover:text-slate-900"
              }`}
              onClick={() => navigate("/")}
            >
              <Home size={18} /> Jobs
            </button>
            {currentUser && (
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname.includes("/dashboard") ? "bg-primary-50 text-primary-700" : "text-slate-400 hover:bg-slate-700 hover:text-slate-900"
                }`}
                onClick={() => navigate(currentUser.role === 'employer' ? "/employer/dashboard" : "/jobseeker/dashboard")}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                  <div className="bg-slate-900 text-primary-700 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                    {getInitials()}
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-sm font-semibold text-slate-200 leading-tight">
                      {currentUser.name || currentUser.fullname || currentUser.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-slate-400 capitalize leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 font-medium text-slate-300 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate("/register")}
                  className="btn-primary"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
