import Property from "../models/property.model.js";


// 🏠 USER DASHBOARD (MY PROPERTIES)
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });

    res.json(properties);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};