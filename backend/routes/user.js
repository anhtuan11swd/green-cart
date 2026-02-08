import express from "express";
import {
  addAddress,
  getAddresses,
  isAuth,
  login,
  logout,
  register,
  updateCart,
} from "../controllers/userAuth.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/is-auth", authUser, isAuth);
router.get("/logout", logout);
router.post("/cart/update", authUser, updateCart);
router.post("/address/add", authUser, addAddress);
router.get("/address/get", authUser, getAddresses);

export default router;
