import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  try {
    const { phone, name } = req.body;

    // 🔹 Validation
    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    // 🔹 Check existing user
    let user = await User.findOne({ phone });

    // 🔹 Create user if not exists
    if (!user) {
      user = await User.create({
        phone,
        name: name || "User",
        role: "user", // default role
      });
    }

    // 🔹 Generate token
    const token = generateToken(user._id);

    // 🔹 Send clean response (IMPORTANT)
    res.status(200).json({
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
      message: error.message || "Server error",
    });
  }
};