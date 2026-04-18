import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    unique: true,
  },
  email: String,
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
}

});

const User = mongoose.model("User", userSchema);

export default User;