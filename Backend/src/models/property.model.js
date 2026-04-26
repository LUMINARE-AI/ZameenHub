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
    title: { type: String, required: true },
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
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: String,
    contact: String,
    image: String,
    images: [String],
    video: String,
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
    carpetArea: Number,
    configuration: String,
    floorNumber: Number,
    totalFloors: Number,
    facing: String,
    overlooking: String,
    propertyAge: String,
    pricePerSqFt: Number,
    highlights: [String],
    averageRating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
