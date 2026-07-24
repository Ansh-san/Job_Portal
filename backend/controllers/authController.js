const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─── POST /api/auth/register ──────────────────────────────────────────────────
/**
 * Register a new user.
 * Body: { fullname, username, email, phone, password, role }
 * Returns: user object + JWT token
 */
const register = async (req, res) => {
  try {
    const { fullname, username, email, phone, password, role } = req.body;

    // Validate required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Create user (password is hashed by the pre-save hook in User model)
    const user = await User.create({
      fullname,
      username: username || "",
      email,
      phone: phone || "",
      password,
      role: role || "Job Seeker",
    });

    // Return user info + token (never return the hashed password)
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration.", error: error.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * Login an existing user.
 * Body: { email, password }
 * Returns: user object + JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare entered password with stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login.", error: error.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
/**
 * Get the currently logged-in user's profile.
 * Requires: protect middleware (JWT in Authorization header)
 */
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  res.status(200).json(req.user);
};

module.exports = { register, login, getMe };
