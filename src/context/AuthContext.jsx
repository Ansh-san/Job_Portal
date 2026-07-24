import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Seed users (migrated from the old hardcoded users.js) ──────────────────
const SEED_USERS = [
  { id: 1, fullname: "Shredhaya", username: "shredhaya", email: "shredhaya@gmail.com", phone: "", password: "shredhaya123", role: "Job Seeker" },
  { id: 2, fullname: "Alice", username: "alice", email: "alice@gmail.com", phone: "", password: "alice123", role: "Job Seeker" },
  { id: 3, fullname: "Rohan", username: "rohan", email: "rohan@gmail.com", phone: "", password: "rohan123", role: "Job Seeker" },
  { id: 4, fullname: "Priya", username: "priya", email: "priya@gmail.com", phone: "", password: "priya123", role: "Job Seeker" },
  { id: 5, fullname: "Amit", username: "amit", email: "amit@gmail.com", phone: "", password: "amit123", role: "Job Seeker" },
  { id: 6, fullname: "Neha", username: "neha", email: "neha@gmail.com", phone: "", password: "neha123", role: "Job Seeker" },
  { id: 7, fullname: "Rahul", username: "rahul", email: "rahul@gmail.com", phone: "", password: "rahul123", role: "Job Seeker" },
  { id: 8, fullname: "Sara", username: "sara", email: "sara@gmail.com", phone: "", password: "sara123", role: "Job Seeker" },
  { id: 9, fullname: "Vivek", username: "vivek", email: "vivek@gmail.com", phone: "", password: "vivek123", role: "Job Seeker" },
  { id: 10, fullname: "Admin", username: "admin", email: "admin@gmail.com", phone: "", password: "admin123", role: "Recruiter" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem("jp_users");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem("jp_users", JSON.stringify(users));
};

const getStoredCurrentUser = () => {
  try {
    const raw = localStorage.getItem("jp_currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

  // On first mount: seed users if localStorage is empty
  useEffect(() => {
    if (!getStoredUsers()) {
      saveStoredUsers(SEED_USERS);
    }
  }, []);

  /**
   * signup – adds a new user to localStorage users array
   * Returns { success: true } or { success: false, message: string }
   */
  const signup = ({ fullname, username, email, phone, password, role }) => {
    const users = getStoredUsers() || [];

    // Check duplicate email
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: Date.now(),
      fullname,
      username,
      email,
      phone,
      password,          // Phase 2 will replace this with bcrypt hash
      role: role || "Job Seeker",
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);
    return { success: true };
  };

  /**
   * login – validates credentials against localStorage users
   * Returns { success: true, user } or { success: false, message: string }
   */
  const login = (email, password) => {
    const users = getStoredUsers() || [];
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    // Store session (omit password from session object)
    const { password: _pw, ...sessionUser } = user;
    localStorage.setItem("jp_currentUser", JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  };

  /**
   * logout – clears session from localStorage and state
   */
  const logout = () => {
    localStorage.removeItem("jp_currentUser");
    setCurrentUser(null);
  };

  /**
   * updateProfile – updates the current user's non-sensitive fields in localStorage
   * Returns { success: true } or { success: false, message: string }
   */
  const updateProfile = ({ fullname, username, phone, role }) => {
    const users = getStoredUsers() || [];
    const idx = users.findIndex(
      (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    if (idx === -1) return { success: false, message: "User not found." };

    users[idx] = { ...users[idx], fullname, username, phone, role };
    saveStoredUsers(users);

    // Update the session object too
    const updatedSession = { ...currentUser, fullname, username, phone, role };
    localStorage.setItem("jp_currentUser", JSON.stringify(updatedSession));
    setCurrentUser(updatedSession);
    return { success: true };
  };

  /**
   * resetPassword – updates the password for a given email in localStorage
   * Returns { success: true } or { success: false, message: string }
   */
  const resetPassword = (email, newPassword) => {
    const users = getStoredUsers() || [];
    const idx = users.findIndex(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (idx === -1) {
      return { success: false, message: "User not found." };
    }
    users[idx].password = newPassword;
    saveStoredUsers(users);
    return { success: true };
  };

  /**
   * emailExists – checks if an email is registered (for forgot password)
   */
  const emailExists = (email) => {
    const users = getStoredUsers() || [];
    return !!users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, signup, resetPassword, emailExists, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
