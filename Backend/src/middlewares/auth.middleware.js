import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    // 🔥 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 3. Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default protect;