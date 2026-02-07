import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: {
      enum: [
        "Rau củ",
        "Trái cây",
        "Đồ uống",
        "Đồ ăn nhanh",
        "Sản phẩm sữa",
        "Bánh mì",
        "Ngũ cốc",
      ],
      required: true,
      type: String,
    },
    description: [{ required: true, type: String }],
    image: [{ required: true, type: String }],
    inStock: { default: true, type: Boolean },
    name: { required: true, trim: true, type: String },
    offerPrice: { min: 0, required: true, type: Number },
    price: { min: 0, required: true, type: Number },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
