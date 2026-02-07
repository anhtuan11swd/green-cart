import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { ref: "Product", type: mongoose.Schema.Types.ObjectId },
        quantity: { default: 1, min: 1, type: Number },
      },
    ],
    email: {
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
      required: true,
      type: String,
      unique: true,
    },
    name: { required: true, trim: true, type: String },
    password: { minlength: 6, required: true, select: false, type: String },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
