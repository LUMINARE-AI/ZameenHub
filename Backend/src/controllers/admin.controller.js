import Property from "../models/property.model.js";


// 📄 GET ALL PENDING PROPERTIES
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("owner", "name phone");

    res.json(properties);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ APPROVE PROPERTY
export const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    res.json(property);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};