import express from "express";
import { clearProducts, seedProducts } from "../controllers/seed.js";

const router = express.Router();

/**
 * Khởi tạo dữ liệu mẫu cho sản phẩm
 * POST /api/seed/products
 */
router.post("/products", seedProducts);

/**
 * Xóa toàn bộ dữ liệu sản phẩm (chỉ development)
 * DELETE /api/seed/products
 */
router.delete("/products", clearProducts);

export default router;
