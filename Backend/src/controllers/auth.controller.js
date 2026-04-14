const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");


// LOGIN / REGISTER (same API)
exports.loginUser = async (req, res) => {
  try {
    const { phone, name } = req.body;

    let user = await User.findOne({ phone });

    // Agar user exist nahi hai → create
    if (!user) {
      user = await User.create({ phone, name });
    }

    res.json({
      user,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};