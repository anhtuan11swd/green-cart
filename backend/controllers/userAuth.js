import jwt from "jsonwebtoken";
import Address from "../models/Address.js";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const user = await User.create({ email, name, password });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "Đăng ký thành công",
      success: true,
      token,
      user: {
        email: user.email,
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      success: true,
      token,
      user: {
        email: user.email,
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Đăng xuất thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Dữ liệu giỏ hàng không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({
      cartItems: user.cartItems,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
    } = req.body;
    const userId = req.user.id;

    const address = await Address.create({
      city,
      country: country || "Việt Nam",
      email,
      firstName,
      lastName,
      phone,
      state,
      street,
      userId,
      zipCode,
    });

    return res.status(201).json({
      address,
      message: "Thêm địa chỉ thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi thêm địa chỉ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      addresses,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách địa chỉ:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
