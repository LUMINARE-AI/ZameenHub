import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
  },
  { timestamps: true }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      minlength: [5, "Property title must be at least 5 characters"],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Plots",
        "Commercial Land",
        "Agricultural Land",
        "Flats",
        "Shops",
        "PG",
        "Flats / Homes",
      ],
      default: "Plots",
    },
    price: {
      type: Number,
      required: [true, "Property price is required"],
      min: [1, "Property price must be greater than zero"],
    },
    location: {
      type: String,
      required: [true, "Property location is required"],
      minlength: [3, "Property location must be at least 3 characters"],
      trim: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      minlength: [20, "Property description must be at least 20 characters"],
      trim: true,
    },
    contact: { type: String, trim: true },
    image: {
      type: String,
      required: [true, "Property image is required"],
      trim: true,
    },
    images: { type: [String], default: [] },
    video: { type: String, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    featured: { type: Boolean, default: false },
    carpetArea: { type: Number, min: 0 },
    configuration: { type: String, trim: true },
    floorNumber: { type: Number, min: 0 },
    totalFloors: { type: Number, min: 0 },
    facing: { type: String, trim: true },
    overlooking: { type: String, trim: true },
    propertyAge: { type: String, trim: true },
    pricePerSqFt: { type: Number, min: 0 },
    highlights: [String],
    averageRating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", propertySchema);
