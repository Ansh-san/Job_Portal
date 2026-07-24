const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect – Express middleware that verifies the JWT in the Authorization header.
 * If valid, attaches the user object to req.user and calls next().
 * If invalid/missing, responds with 401 Unauthorized.
 *
 * Usage: add `protect` as middleware before any route that needs auth.
 *   router.get("/jobs", protect, jobController.getAllJobs);
 */
const protect = async (req, res, next) => {
  let token;

  // JWT is expected as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify & decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Token invalid." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorised. Token failed." });
    }
  } else {
    return res.status(401).json({ message: "Not authorised. No token provided." });
  }
};

/**
 * restrictTo – middleware factory to limit access to specific roles.
 * Usage: restrictTo("Recruiter", "Admin")
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This route is restricted to: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
