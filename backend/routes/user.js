import express from "express";
import { isAuth, login, logout, register } from "../controllers/userAuth.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

// Routes cho người dùng
router.post("/register", register);
router.post("/login", login);
router.get("/is-auth", authUser, isAuth);
router.get("/logout", logout);

export default router;
