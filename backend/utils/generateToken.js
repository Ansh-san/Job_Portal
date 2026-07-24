const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for a user.
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string} signed JWT token (expires in 7 days)
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
