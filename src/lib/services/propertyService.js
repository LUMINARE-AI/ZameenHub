import Property from "@/lib/models/Property";
import { uploadImage } from "@/lib/upload";

export const PROPERTY_CATEGORIES = [
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

function getHighlights(value) {
  if (Array.isArray(value)) {
    return value.map(text).filter(Boolean);
  }

  return text(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function coordinate(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidCoordinates(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

async function buildPropertyPayload(body, user, imageUrl) {
  const price = positiveNumber(body.price);
  const carpetArea = optionalNumber(body.carpetArea);
  const enteredPricePerSqFt = optionalNumber(body.pricePerSqFt);
  const latitude = coordinate(body.latitude);
  const longitude = coordinate(body.longitude);

  return {
    title: text(body.title),
    category: text(body.category) || "Plots",
    price,
    location: text(body.location),
    latitude: isValidCoordinates(latitude, longitude) ? latitude : undefined,
    longitude: isValidCoordinates(latitude, longitude) ? longitude : undefined,
    description: text(body.description),
    image: imageUrl,
    contact: user?.phone || "",
    owner: user?._id,
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

  if (!isValidCoordinates(payload.latitude, payload.longitude)) {
    return "Pin the exact property location on the map";
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

function formDataToObject(formData) {
  const body = {};

  for (const [key, value] of formData.entries()) {
    if (key !== "image") {
      body[key] = value;
    }
  }

  return body;
}

export async function listProperties(searchParams) {
  const filters = { status: "approved" };
  const category = text(searchParams.get("category"));
  const location = text(searchParams.get("location"));
  const maxPrice = positiveNumber(searchParams.get("maxPrice"));

  if (category) {
    if (!PROPERTY_CATEGORIES.includes(category)) {
      const error = new Error("Select a valid property category");
      error.status = 400;
      throw error;
    }

    filters.category = category;
  }

  if (location) {
    filters.location = { $regex: location, $options: "i" };
  }

  if (maxPrice) {
    filters.price = { $lte: maxPrice };
  }

  return Property.find(filters).populate("owner", "name phone").sort({ createdAt: -1 });
}

export async function createProperty(formData, user) {
  const body = formDataToObject(formData);
  const imageFile = formData.get("image");
  const imageUrl = await uploadImage(imageFile);
  const payload = await buildPropertyPayload(body, user, imageUrl);
  const validationError = validateRequiredPropertyFields(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const property = await Property.create(payload);

  return {
    message: "Property submitted successfully and is pending approval",
    property,
  };
}

export async function updateProperty(id, body, user) {
  const property = await Property.findById(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  if (property.owner.toString() !== user._id.toString()) {
    const error = new Error("You can only edit your own properties");
    error.status = 403;
    throw error;
  }

  const allowedFields = [
    "title",
    "category",
    "price",
    "location",
    "latitude",
    "longitude",
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
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  [
    "title",
    "category",
    "location",
    "description",
    "configuration",
    "facing",
    "overlooking",
    "propertyAge",
  ].forEach((field) => {
    if (updates[field] !== undefined) {
      updates[field] = text(updates[field]);
    }
  });

  if (updates.category !== undefined && !PROPERTY_CATEGORIES.includes(updates.category)) {
    const error = new Error("Select a valid property category");
    error.status = 400;
    throw error;
  }

  if (updates.price !== undefined) {
    updates.price = positiveNumber(updates.price);

    if (!updates.price) {
      const error = new Error("Enter a valid property price");
      error.status = 400;
      throw error;
    }
  }

  ["carpetArea", "floorNumber", "totalFloors", "pricePerSqFt"].forEach((field) => {
    if (updates[field] !== undefined) {
      updates[field] = optionalNumber(updates[field]);
    }
  });

  ["latitude", "longitude"].forEach((field) => {
    if (updates[field] !== undefined) {
      updates[field] = coordinate(updates[field]);
    }
  });

  if (updates.highlights !== undefined) {
    updates.highlights = getHighlights(updates.highlights);
  }

  const updated = await Property.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("owner", "name phone");

  return {
    message: "Property updated successfully",
    property: updated,
  };
}

export async function rateProperty(id, body, user) {
  const property = await Property.findById(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  const rating = Number(body.rating);
  const comment = text(body.comment);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.status = 400;
    throw error;
  }

  const existingReview = property.reviews.find(
    (review) => review.user.toString() === user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.updatedAt = new Date();
  } else {
    property.reviews.push({
      user: user._id,
      rating,
      comment,
    });
  }

  property.numberOfReviews = property.reviews.length;
  property.averageRating =
    property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.numberOfReviews;

  await property.save();

  return {
    message: "Rating submitted successfully",
    property,
  };
}

export async function deleteProperty(id, user) {
  const property = await Property.findById(id);

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "admin" && property.owner.toString() !== user._id.toString()) {
    const error = new Error("You can only delete your own properties");
    error.status = 403;
    throw error;
  }

  await property.deleteOne();

  return { message: "Property deleted successfully" };
}
