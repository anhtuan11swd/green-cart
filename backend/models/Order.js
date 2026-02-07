import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  image: { required: true, type: String },
  name: { required: true, type: String },
  offerPrice: { required: true, type: Number },
  price: { required: true, type: Number },
  product: {
    ref: "Product",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: { default: 1, min: 1, required: true, type: Number },
});

const orderSchema = new mongoose.Schema(
  {
    address: {
      city: { required: true, type: String },
      country: { required: true, type: String },
      email: { required: true, type: String },
      firstName: { required: true, type: String },
      lastName: { required: true, type: String },
      phone: { required: true, type: String },
      state: { required: true, type: String },
      street: { required: true, type: String },
      zipCode: { required: true, type: String },
    },
    amount: { min: 0, required: true, type: Number },
    isPaid: { default: false, type: Boolean },
    items: [orderItemSchema],
    paymentType: {
      default: "Tiền mặt",
      enum: ["Tiền mặt", "Thanh toán online"],
      type: String,
    },
    status: {
      default: "Đang xử lý",
      enum: [
        "Đang xử lý",
        "Đã xác nhận",
        "Đang giao hàng",
        "Đã giao hàng",
        "Đã hủy",
        "Hoàn tiền",
      ],
      type: String,
    },
    userId: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
