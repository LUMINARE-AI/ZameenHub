import Property from "../models/property.model.js";

export const getMyProperties = async (req, res) => {
  try {
    // 🔥 DEBUG
    console.log("USER:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const properties = await Property.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(properties);

  } catch (error) {
    console.log("DASHBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};