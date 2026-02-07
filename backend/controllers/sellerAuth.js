import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const sellerEmail = process.env.SELLER_EMAIL;
    const sellerPassword = process.env.SELLER_PASSWORD;

    if (!sellerEmail || !sellerPassword) {
      return res
        .status(500)
        .json({ message: "Cấu hình seller chưa được thiết lập" });
    }

    if (email !== sellerEmail || password !== sellerPassword) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { role: "seller", type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

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

export const isAuth = async (req, res) => {
  try {
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

export const logout = async (_req, res) => {
  try {
    return res.status(200).json({
      message: "Đăng xuất seller thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi đăng xuất seller:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
