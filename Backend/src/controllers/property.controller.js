import Property from "../models/property.model.js";

const PROPERTY_CATEGORIES = [
  "Plots",
  "Commercial Land",
  "Agricultural Land",
  "Flats",
  "Shops",
  "PG",
  "Flats / Homes",
];

// ➕ ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    console.log("🔥 ADD PROPERTY");

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const title = String(req.body.title || "").trim();
    const category = String(req.body.category || "Plots").trim();
    const price = Number(req.body.price);
    const location = String(req.body.location || "").trim();
    const description = String(req.body.description || "").trim();
    const image = req.file?.path || req.file?.secure_url || req.file?.url || "";

    if (!title || !price || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!PROPERTY_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Select a valid property category" });
    }

    const property = await Property.create({
      title,
      category,
      price,
      location,
      description,
      image,
      contact: req.user.phone || "",
      owner: req.user._id,
      status: "pending",
    });

    res.status(201).json(property);

  } catch (error) {
    console.log("🔥 REAL ERROR:", error); // 👈 ye important hai
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET APPROVED PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const filters = { status: "approved" };
    const category = String(req.query.category || "").trim();
    const location = String(req.query.location || "").trim();
    const maxPrice = Number(req.query.maxPrice);

    if (category) {
      filters.category = category;
    }

    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    if (Number.isFinite(maxPrice) && maxPrice > 0) {
      filters.price = { $lte: maxPrice };
    }

    const properties = await Property.find(filters)
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

    if (updates.category !== undefined && !PROPERTY_CATEGORIES.includes(updates.category)) {
      return res.status(400).json({ message: "Select a valid property category" });
    }

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

    if (
      req.user.role !== "admin" &&
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await property.deleteOne();

    res.json({ message: "Property deleted" });
  } catch (error) {
    console.log("❌ DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
