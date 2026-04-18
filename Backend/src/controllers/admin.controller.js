import Property from "../models/property.model.js";

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export default isAdmin;
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

// DELETE PROPERTY (ADMIN)
export const deletePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await Property.findByIdAndDelete(id);

    res.json({ message: "Property deleted by admin" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};