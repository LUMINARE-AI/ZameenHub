import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: String,
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
    price: Number,
    location: String,
    description: String,
    contact: String,
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
    image: {
  type: String,
  },
  },
  { timestamps: true }
);


export default mongoose.model("Property", propertySchema);
