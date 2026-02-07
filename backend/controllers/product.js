import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

/**
 * Tạo sản phẩm mới
 * POST /api/product/add
 * Middleware: authSeller, upload.array('images', 5)
 */
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, offerPrice, description, inStock } =
      req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Vui lòng tải lên ít nhất 1 ảnh" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "green-cart/products",
          resource_type: "image",
        },
      );
      imageUrls.push(result.secure_url);
    }

    let parsedDescription = [];
    try {
      parsedDescription = description ? JSON.parse(description) : [];
    } catch (error) {
      return res.status(400).json({
        error: error.message,
        message: "Dữ liệu mô tả sản phẩm không hợp lệ",
      });
    }

    const product = new Product({
      category,
      description: parsedDescription,
      image: imageUrls,
      inStock: inStock === "true" || inStock === true,
      name,
      offerPrice: Number(offerPrice),
      price: Number(price),
    });

    await product.save();

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product,
    });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    res.status(500).json({ error: error.message, message: "Lỗi server" });
  }
};

/**
 * Lấy danh sách tất cả sản phẩm
 * GET /api/product/list
 */
export const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: error.message, message: "Lỗi server" });
  }
};

/**
 * Lấy chi tiết một sản phẩm
 * GET /api/product/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    res.status(500).json({ error: error.message, message: "Lỗi server" });
  }
};

/**
 * Xóa sản phẩm
 * DELETE /api/product/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    if (product.image && product.image.length > 0) {
      for (const imageUrl of product.image) {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`green-cart/products/${publicId}`);
        } catch (cloudinaryError) {
          console.error("Lỗi xóa ảnh trên Cloudinary:", cloudinaryError);
        }
      }
    }

    res.json({ message: "Xóa sản phẩm thành công", product });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    res.status(500).json({ error: error.message, message: "Lỗi server" });
  }
};

/**
 * Toggle trạng thái inStock
 * POST /api/product/stock
 */
export const toggleStock = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.json({
      message: `Cập nhật trạng thái tồn kho thành công (${product.inStock ? "Còn hàng" : "Hết hàng"})`,
      product,
    });
  } catch (error) {
    console.error("Lỗi cập nhật stock:", error);
    res.status(500).json({ error: error.message, message: "Lỗi server" });
  }
};
