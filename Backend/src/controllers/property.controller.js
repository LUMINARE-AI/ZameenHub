import Property from "../models/property.model.js";


// ➕ ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("owner", "name phone");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};