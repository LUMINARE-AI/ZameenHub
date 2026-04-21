import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  try {
    const normalizedPhone = String(req.body.phone || "").trim();
    const normalizedName = String(req.body.name || "").trim();

    if (!normalizedPhone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        name: normalizedName || "New User",
      });
    }

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
