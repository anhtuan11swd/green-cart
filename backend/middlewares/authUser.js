import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware xác thực người dùng từ cookie
export const authUser = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    // Xác thực JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    // Gán user vào request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi xác thực người dùng:", error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
