const jwt = require("jsonwebtoken");

// Needs to generate JWT secret key later
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRES_IN || "1h";

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
