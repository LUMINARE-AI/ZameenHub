import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


// 🔐 LOGIN CHECK
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// 👑 ADMIN CHECK
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};