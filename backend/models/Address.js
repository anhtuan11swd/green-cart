import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    city: { required: true, trim: true, type: String },
    country: { default: "Việt Nam", required: true, trim: true, type: String },
    email: {
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
      required: true,
      type: String,
    },
    firstName: { required: true, trim: true, type: String },
    lastName: { required: true, trim: true, type: String },
    phone: { required: true, trim: true, type: String },
    state: { required: true, trim: true, type: String },
    street: { required: true, trim: true, type: String },
    userId: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    zipCode: { required: true, trim: true, type: String },
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
