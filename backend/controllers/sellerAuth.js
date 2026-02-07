import jwt from "jsonwebtoken";

// Đăng nhập seller (admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Lấy credentials từ .env
    const sellerEmail = process.env.SELLER_EMAIL;
    const sellerPassword = process.env.SELLER_PASSWORD;

    // Kiểm tra credentials
    if (!sellerEmail || !sellerPassword) {
      return res
        .status(500)
        .json({ message: "Cấu hình seller chưa được thiết lập" });
    }

    // So sánh với credentials trong .env
    if (email !== sellerEmail || password !== sellerPassword) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { role: "seller", type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    // Trả về Bearer token
    return res.status(200).json({
      message: "Đăng nhập seller thành công",
      success: true,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập seller:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Kiểm tra seller đã đăng nhập chưa (Bearer token middleware)
export const isAuth = async (req, res) => {
  try {
    // Token đã được xác thực bởi middleware
    return res.status(200).json({
      isAuthenticated: true,
      seller: {
        role: req.user?.role || "seller",
      },
      success: true,
    });
  } catch (error) {
    console.error("Lỗi xác thực seller:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng xuất seller
export const logout = async (_req, res) => {
  try {
    // Với Bearer token, client sẽ xóa token ở phía client
    return res.status(200).json({
      message: "Đăng xuất seller thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi đăng xuất seller:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
