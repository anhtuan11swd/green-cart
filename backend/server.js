import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectCloudinary from "./configs/cloudinary.js";
// Import configs
import connectDB from "./configs/db.js";
import sellerRoutes from "./routes/seller.js";
// Import routes
import userRoutes from "./routes/user.js";

// Tải các biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối Database và Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Các tuyến đường
app.get("/", (_req, res) => {
  res.json({ message: "Chào mừng đến với Green Cart API" });
});

// Routes Authentication
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

export default app;
