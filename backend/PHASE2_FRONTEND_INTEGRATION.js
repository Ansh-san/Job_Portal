// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 Frontend Integration – Replace localStorage with API calls
// 
// Step 1: Install axios in the frontend
//   cd c:\Users\ROYAL\Desktop\Anudip-Projects\Myfirstapp
//   npm install axios
//
// Step 2: Create src/api/axiosConfig.js  (shown below)
// Step 3: Update AuthContext.jsx to use the API functions
// ─────────────────────────────────────────────────────────────────────────────

// ── FILE: src/api/axiosConfig.js ─────────────────────────────────────────────
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the JWT to every request if it exists in localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("jp_currentUser") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;


// ── FILE: src/api/auth.js ─────────────────────────────────────────────────────
import API from "./axiosConfig";

export const registerAPI = (userData) => API.post("/auth/register", userData);
export const loginAPI = (credentials) => API.post("/auth/login", credentials);
export const getMeAPI = () => API.get("/auth/me");


// ── FILE: src/api/jobs.js ─────────────────────────────────────────────────────
import API from "./axiosConfig";

export const getAllJobsAPI = (params) => API.get("/jobs", { params });
export const getJobByIdAPI = (id) => API.get(`/jobs/${id}`);
export const createJobAPI = (jobData) => API.post("/jobs", jobData);
export const updateJobAPI = (id, jobData) => API.put(`/jobs/${id}`, jobData);
export const deleteJobAPI = (id) => API.delete(`/jobs/${id}`);


// ── UPDATE: src/context/AuthContext.jsx (Phase 2 version) ────────────────────
// 
// Replace the `signup` function:
//
//   const signup = async ({ fullname, username, email, phone, password, role }) => {
//     try {
//       const { data } = await registerAPI({ fullname, username, email, phone, password, role });
//       // data contains { _id, fullname, email, role, token }
//       localStorage.setItem("jp_currentUser", JSON.stringify(data));
//       setCurrentUser(data);
//       return { success: true };
//     } catch (error) {
//       const msg = error.response?.data?.message || "Registration failed.";
//       return { success: false, message: msg };
//     }
//   };
//
// Replace the `login` function:
//
//   const login = async (email, password) => {
//     try {
//       const { data } = await loginAPI({ email, password });
//       localStorage.setItem("jp_currentUser", JSON.stringify(data));
//       setCurrentUser(data);
//       return { success: true, user: data };
//     } catch (error) {
//       const msg = error.response?.data?.message || "Login failed.";
//       return { success: false, message: msg };
//     }
//   };
//
// The `logout` function stays the same (just clears localStorage).
//
// ── UPDATE: src/pages/Home.jsx (Phase 2 version) ─────────────────────────────
//
// Replace the static jobs import with an API call:
//
//   import { useState, useEffect } from "react";
//   import { getAllJobsAPI } from "../api/jobs";
//
//   const Home = () => {
//     const [jobs, setJobs] = useState([]);
//     const [filteredJobs, setFilteredJobs] = useState([]);
//
//     useEffect(() => {
//       getAllJobsAPI().then(({ data }) => {
//         setJobs(data);
//         setFilteredJobs(data);
//       });
//     }, []);
//     // ... rest of component unchanged
//   };
