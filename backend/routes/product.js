import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  toggleStock,
} from "../controllers/product.js";
import { authSeller } from "../middlewares/authSeller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/add", authSeller, upload.array("images", 5), addProduct);
router.get("/list", getAllProducts);
router.get("/:id", getProductById);
router.post("/stock/:id", authSeller, toggleStock);
router.delete("/:id", authSeller, deleteProduct);

export default router;
