import express from "express";
import {
  createCODOrder,
  getSellerOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.js";
import { authSeller } from "../middlewares/authSeller.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

// User routes
router.post("/cod", authUser, createCODOrder);
router.get("/user", authUser, getUserOrders);

// Seller/Admin routes
router.get("/seller", authSeller, getSellerOrders);
router.post("/status", authSeller, updateOrderStatus);

export default router;
