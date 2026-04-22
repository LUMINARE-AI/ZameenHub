import Property from "../models/property.model.js";

export const addProperty = async (req, res) => {
  try {
    const image = req.file?.path;
    const ownerId = req.user?._id || req.user?.id;
    const title = String(req.body.title || "").trim();
    const location = String(req.body.location || "").trim();
    const description = String(req.body.description || "").trim();
    const price = Number(req.body.price);

    if (!ownerId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    if (!title || !location || !description) {
      return res.status(400).json({
        message: "Title, location, and description are required",
      });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: "Enter a valid property price" });
    }

    const property = await Property.create({
      ...req.body,
      title,
      price,
      location,
      description,
      image,
      owner: ownerId,
      status: "pending",
    });

    res.status(201).json(property);
  } catch (error) {
  console.log("ERROR:", error); // 👈 ADD THIS
  res.status(500).json({ message: error.message });
}
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" });
    res.json(properties);
  } catch (error) {
  console.log("ADD PROPERTY ERROR:", error); // 🔥 MUST
  res.status(500).json({ message: error.message });
}
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updates = { ...req.body };

    if (updates.price !== undefined) {
      const price = Number(updates.price);

      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ message: "Enter a valid property price" });
      }

      updates.price = price;
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await property.deleteOne();

    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
