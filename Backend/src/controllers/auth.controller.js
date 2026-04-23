import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function buildAuthResponse(user) {
  return {
    token: generateToken(user._id, user.role),
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  };
}

export const signup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const trimmedName = String(name || "").trim();
    const normalizedPhone = normalizePhone(phone);
    const normalizedPassword = String(password || "").trim();

    if (!trimmedName || !normalizedPhone || !normalizedPassword) {
      return res.status(400).json({
        message: "Name, phone, and password are required",
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
      });
    }

    if (normalizedPhone.length < 10) {
      return res.status(400).json({
        message: "Phone number must be at least 10 digits",
      });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ phone: normalizedPhone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(normalizedPassword, salt);

    const user = await User.create({
      name: trimmedName,
      phone: normalizedPhone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      ...buildAuthResponse(user),
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    res.status(500).json({
      message: error.message || "Server error during signup",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const normalizedPhone = normalizePhone(phone);
    const normalizedPassword = String(password || "").trim();

    if (!normalizedPhone || !normalizedPassword) {
      return res.status(400).json({
        message: "Phone and password are required",
      });
    }

    const user = await User.findOne({ phone: normalizedPhone }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid phone or password",
      });
    }

    const isPasswordValid = await user.comparePassword(normalizedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid phone or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      ...buildAuthResponse(user),
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error during login",
    });
  }
};
