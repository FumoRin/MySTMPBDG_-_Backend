const jwt = require("jsonwebtoken");
const JWT_SECRET = "your-secret-key"; // needs to use env var later and generate jwt secret

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  },
};

module.exports = authMiddleware;
