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

function text(value) {
  return String(value || "").trim();
}

function positiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function optionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function getUploadedImage(req) {
  return req.file?.path || req.file?.secure_url || req.file?.url || "";
}

function getHighlights(value) {
  if (Array.isArray(value)) {
    return value.map(text).filter(Boolean);
  }

  return text(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPropertyPayload(body, req) {
  const price = positiveNumber(body.price);
  const carpetArea = optionalNumber(body.carpetArea);
  const enteredPricePerSqFt = optionalNumber(body.pricePerSqFt);

  return {
    title: text(body.title),
    category: text(body.category) || "Plots",
    price,
    location: text(body.location),
    description: text(body.description),
    image: getUploadedImage(req),
    contact: req.user?.phone || "",
    owner: req.user?._id,
    status: "pending",
    featured: body.featured === true || body.featured === "true",
    carpetArea,
    configuration: text(body.configuration),
    floorNumber: optionalNumber(body.floorNumber),
    totalFloors: optionalNumber(body.totalFloors),
    facing: text(body.facing),
    overlooking: text(body.overlooking),
    propertyAge: text(body.propertyAge),
    pricePerSqFt:
      enteredPricePerSqFt || (price && carpetArea ? Math.round(price / carpetArea) : undefined),
    highlights: getHighlights(body.highlights),
  };
}

function validateRequiredPropertyFields(payload) {
  if (!payload.title || payload.title.length < 5) {
    return "Property title must be at least 5 characters";
  }

  if (!payload.location || payload.location.length < 3) {
    return "Property location must be at least 3 characters";
  }

  if (!payload.description || payload.description.length < 20) {
    return "Property description must be at least 20 characters";
  }

  if (!payload.price) {
    return "Enter a valid property price";
  }

  if (!payload.image) {
    return "Property image is required";
  }

  if (!PROPERTY_CATEGORIES.includes(payload.category)) {
    return "Select a valid property category";
  }

  return "";
}

export const addProperty = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required to list a property" });
    }

    const payload = buildPropertyPayload(req.body, req);
    const validationError = validateRequiredPropertyFields(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const property = await Property.create(payload);

    return res.status(201).json({
      message: "Property submitted successfully and is pending approval",
      property,
    });
  } catch (error) {
    console.error("ADD PROPERTY ERROR:", error);
    return next(error);
  }
};

export const getProperties = async (req, res, next) => {
  try {
    const filters = { status: "approved" };
    const category = text(req.query.category);
    const location = text(req.query.location);
    const maxPrice = positiveNumber(req.query.maxPrice);

    if (category) {
      if (!PROPERTY_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Select a valid property category" });
      }

      filters.category = category;
    }

    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }

    if (maxPrice) {
      filters.price = { $lte: maxPrice };
    }

    const properties = await Property.find(filters)
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    return res.json(properties);
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);
    return next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own properties" });
    }

    const allowedFields = [
      "title",
      "category",
      "price",
      "location",
      "description",
      "carpetArea",
      "configuration",
      "floorNumber",
      "totalFloors",
      "facing",
      "overlooking",
      "propertyAge",
      "pricePerSqFt",
      "highlights",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    ["title", "category", "location", "description", "configuration", "facing", "overlooking", "propertyAge"].forEach(
      (field) => {
        if (updates[field] !== undefined) {
          updates[field] = text(updates[field]);
        }
      }
    );

    if (updates.category !== undefined && !PROPERTY_CATEGORIES.includes(updates.category)) {
      return res.status(400).json({ message: "Select a valid property category" });
    }

    if (updates.price !== undefined) {
      updates.price = positiveNumber(updates.price);

      if (!updates.price) {
        return res.status(400).json({ message: "Enter a valid property price" });
      }
    }

    ["carpetArea", "floorNumber", "totalFloors", "pricePerSqFt"].forEach((field) => {
      if (updates[field] !== undefined) {
        updates[field] = optionalNumber(updates[field]);
      }
    });

    if (updates.highlights !== undefined) {
      updates.highlights = getHighlights(updates.highlights);
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("owner", "name phone");

    return res.json({
      message: "Property updated successfully",
      property: updated,
    });
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    return next(error);
  }
};

export const rateProperty = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required to rate properties" });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const rating = Number(req.body.rating);
    const comment = text(req.body.comment);

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingReview = property.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.updatedAt = new Date();
    } else {
      property.reviews.push({
        user: req.user._id,
        rating,
        comment,
      });
    }

    property.numberOfReviews = property.reviews.length;
    property.averageRating =
      property.reviews.reduce((sum, review) => sum + review.rating, 0) /
      property.numberOfReviews;

    await property.save();

    return res.json({
      message: "Rating submitted successfully",
      property,
    });
  } catch (error) {
    console.error("RATING ERROR:", error);
    return next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (
      req.user.role !== "admin" &&
      property.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only delete your own properties" });
    }

    await property.deleteOne();

    return res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);
    return next(error);
  }
};
