import Property from "../models/property.model.js";

export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
