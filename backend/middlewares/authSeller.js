import jwt from "jsonwebtoken";

// Middleware xác thực seller từ Bearer token
export const authSeller = async (req, res, next) => {
  try {
    // Lấy token từ Authorization header (Bearer token)
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Vui lòng đăng nhập seller" });
    }

    const token = authHeader.split(" ")[1];

    // Xác thực JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra role
    if (decoded.role !== "seller" || decoded.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập seller" });
    }

    // Gán user vào request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi xác thực seller:", error);
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
