import Property from "../models/property.model.js";

export const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("owner", "name phone role")
      .sort({ createdAt: -1 });

    return res.json(properties);
  } catch (error) {
    console.error("ADMIN PENDING ERROR:", error);
    return next(error);
  }
};

export const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.status = "approved";
    await property.save();

    return res.json({
      message: "Property approved successfully",
      property,
    });
  } catch (error) {
    console.error("ADMIN APPROVE ERROR:", error);
    return next(error);
  }
};

export const deletePropertyAdmin = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.json({ message: "Property deleted by admin" });
  } catch (error) {
    console.error("ADMIN DELETE ERROR:", error);
    return next(error);
  }
};
