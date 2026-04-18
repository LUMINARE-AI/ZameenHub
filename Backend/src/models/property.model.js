import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    location: String,
    description: String,
    contact: String,
    images: [String],

    video: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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