import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // 🔹 Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, phone, and password are required",
      });
    }

    // 🔹 Validate phone format (basic)
    if (phone.length < 10) {
      return res.status(400).json({
        message: "Phone number must be at least 10 digits",
      });
    }

    // 🔹 Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 🔹 Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        message: "Phone number already registered. Please login instead.",
      });
    }

    // 🔹 Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      password,
      role: "user",
    });

    // 🔹 Generate token
    const token = generateToken(user._id, user.role);

    // 🔹 Send response (password is not returned due to select: false)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error.message);

    // Handle unique constraint error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Phone number already registered",
      });
    }

    res.status(500).json({
      message: error.message || "Server error during signup",
    });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 🔹 Validate required fields
    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    // 🔹 Find user by phone (include password for comparison)
    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid phone or password",
      });
    }

    // 🔹 Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid phone or password",
      });
    }

    // 🔹 Generate token
    const token = generateToken(user._id, user.role);

    // 🔹 Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error during login",
    });
  }
};