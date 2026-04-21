import Property from "../models/property.model.js";


// ➕ ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    const image = req.file?.path;
    const ownerId = req.user?._id || req.user?.id;

    if (!ownerId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const property = await Property.create({
      ...req.body,
      image,
      owner: ownerId,
      status: "pending",
    });

    res.status(201).json(property);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 GET ALL (ONLY APPROVED)
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ UPDATE PROPERTY
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Owner check
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🗑 DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Owner check
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await property.deleteOne();

    res.json({ message: "Property deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
