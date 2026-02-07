import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectCloudinary from "./configs/cloudinary.js";
import connectDB from "./configs/db.js";
import { autoSeedProducts } from "./controllers/seed.js";
import productRoutes from "./routes/product.js";
import seedRoutes from "./routes/seed.js";
import sellerRoutes from "./routes/seller.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
connectCloudinary();

// Khởi tạo dữ liệu mẫu tự động nếu database rỗng
autoSeedProducts();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "Chào mừng đến với Green Cart API" });
});

app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/seed", seedRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

export default app;
