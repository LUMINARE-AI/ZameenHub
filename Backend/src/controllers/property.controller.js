import Property from "../models/property.model.js";

// ➕ ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    console.log("🔥 ADD PROPERTY REQUEST");

    // 🔥 SAFE USER FETCH
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const ownerId = req.user._id;

    // 🔥 CLEAN DATA
    const title = String(req.body.title || "").trim();
    const location = String(req.body.location || "").trim();
    const description = String(req.body.description || "").trim();
    const price = Number(req.body.price);

    const image = req.file?.path || "";

    console.log("Parsed:", { title, location, description, price, ownerId, image });

    // 🔥 VALIDATION
    if (!title || !location || !description) {
      return res.status(400).json({
        message: "Title, location, and description are required",
      });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        message: "Enter a valid property price",
      });
    }

    // 🔥 CREATE PROPERTY
    const property = await Property.create({
      title,
      price,
      location,
      description,
      image,
      owner: ownerId,
      status: "pending",
    });

    console.log("✅ Property created:", property);

    res.status(201).json(property);
  } catch (error) {
    console.log("❌ ADD PROPERTY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET APPROVED PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.log("❌ GET PROPERTIES ERROR:", error);
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

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updates = { ...req.body };

    // 🔥 SAFE PRICE
    if (updates.price !== undefined) {
      const price = Number(updates.price);

      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({
          message: "Enter a valid property price",
        });
      }

      updates.price = price;
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.log("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PROPERTY
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
    console.log("❌ DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};