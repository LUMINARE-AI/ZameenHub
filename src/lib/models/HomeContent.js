import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    slot: { type: Number, required: true, min: 0, max: 2 },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const homeContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
      trim: true,
    },
    heroSlides: {
      type: [heroSlideSchema],
      default: [],
    },
    testimonials: {
      type: [testimonialSchema],
      default: [],
    },
    // Keeps deleted testimonials deleted: defaults are seeded only once, ever.
    testimonialsSeeded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomeContent || mongoose.model("HomeContent", homeContentSchema);
