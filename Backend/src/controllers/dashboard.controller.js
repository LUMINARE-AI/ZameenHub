import Property from "../models/property.model.js";

export const getMyProperties = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Login required" });
    }

    const properties = await Property.find({
      owner: req.user._id,
    })
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    return res.json(properties);
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return next(error);
  }
};
