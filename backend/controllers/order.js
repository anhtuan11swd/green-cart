import Order from "../models/Order.js";
import Product from "../models/Product.js";

/**
 * Tạo đơn hàng COD (Cash on Delivery)
 * Tính tổng tiền: (price × quantity) + tax 2%
 */
export const createCODOrder = async (req, res) => {
  try {
    const { items, addressId } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    // Lấy thông tin address từ database
    const Address = (await import("../models/Address.js")).default;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }

    // Chuẩn bị order items và tính tổng tiền
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Sản phẩm ${item.product} không tồn tại` });
      }

      const quantity = item.quantity || 1;
      const price = product.offerPrice || product.price;
      subtotal += price * quantity;

      orderItems.push({
        image: product.image[0],
        name: product.name,
        offerPrice: product.offerPrice,
        price: product.price,
        product: product._id,
        quantity,
      });
    }

    // Tính thuế 2% và tổng tiền
    const taxRate = 0.02;
    const taxAmount = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxAmount;

    const order = await Order.create({
      address: {
        city: address.city,
        country: address.country,
        email: address.email,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        state: address.state,
        street: address.street,
        zipCode: address.zipCode,
      },
      amount: totalAmount,
      items: orderItems,
      paymentType: "Tiền mặt",
      userId,
    });

    return res.status(201).json({
      message: "Đặt hàng thành công",
      order,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng COD:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Lấy danh sách đơn hàng của user (có populate product & address)
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate("items.product", "name image offerPrice price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng user:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Lấy tất cả đơn hàng cho seller/admin
 */
export const getSellerOrders = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name image offerPrice price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng seller:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Cập nhật trạng thái đơn hàng (cho seller/admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      order,
      success: true,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
