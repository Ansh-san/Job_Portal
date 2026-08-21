import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setCurrentUser(parsed);
      } catch (err) {
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      // Map frontend fields to backend expected fields if necessary
      // Backend User model expects: name, email, password, role
      const payload = {
        name: userData.fullname || userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role === "Employer" ? "employer" : "jobseeker",
      };
      
      const data = await authService.register(payload);
      setCurrentUser(data);
      return { success: true, user: data };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success("Logged out successfully");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
