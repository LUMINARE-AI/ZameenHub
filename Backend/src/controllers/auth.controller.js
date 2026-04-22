import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, name });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};