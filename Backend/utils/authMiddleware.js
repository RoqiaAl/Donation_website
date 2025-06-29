"use strict";

const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

// Use your JWT secret (set in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Middleware to check if the user is logged in and the JWT is valid.
 * Expects the token to be provided in the Authorization header as: "Bearer <token>".
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token. If valid, the decoded payload is attached to req.user.
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authMiddleware;
