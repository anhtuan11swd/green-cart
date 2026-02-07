import express from "express";
import { isAuth, login, logout } from "../controllers/sellerAuth.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

router.post("/login", login);
router.get("/is-auth", authSeller, isAuth);
router.get("/logout", logout);

export default router;
