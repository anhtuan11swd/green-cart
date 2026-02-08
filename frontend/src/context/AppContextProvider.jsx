import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

// Cấu hình Axios instance với Bearer token
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Thiết lập interceptor ngay khi module được load
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sellerToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Hàm định dạng giá tiền theo chuẩn Việt Nam
const formatVND = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
    style: "currency",
  }).format(price);
};

// Context provider quản lý trạng thái toàn cục của ứng dụng
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sellerToken, setSellerToken] = useState(() => {
    return localStorage.getItem("sellerToken") || null;
  });
  const [isSeller, setIsSeller] = useState(() => {
    return JSON.parse(localStorage.getItem("isSeller") || "false");
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  // Lưu sellerToken vào localStorage khi thay đổi
  useEffect(() => {
    if (sellerToken) {
      localStorage.setItem("sellerToken", sellerToken);
    } else {
      localStorage.removeItem("sellerToken");
    }
  }, [sellerToken]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    // Cập nhật cart count
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("cartCount", totalCount.toString());
    // Dispatch event để các component khác cập nhật
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  // Lưu isSeller state vào localStorage
  useEffect(() => {
    localStorage.setItem("isSeller", JSON.stringify(isSeller));
  }, [isSeller]);

  // Function để logout seller
  const logoutSeller = useCallback(() => {
    setSellerToken(null);
    setIsSeller(false);
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    try {
      const response = await api.get(`/api/product/${itemId}`);
      const product = response.data;

      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item._id === itemId);

        if (existingItem) {
          // Tăng số lượng nếu sản phẩm đã tồn tại
          return prevCart.map((item) =>
            item._id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          // Thêm sản phẩm mới
          return [
            ...prevCart,
            {
              _id: product._id,
              category: product.category,
              image: product.image,
              name: product.name,
              offerPrice: product.offerPrice,
              quantity: 1,
            },
          ];
        }
      });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
      throw error;
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ
  const updateCart = (itemId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId
          ? { ...item, quantity: Math.min(quantity, 99) } // Giới hạn tối đa 99
          : item,
      ),
    );
  };

  // Giảm số lượng hoặc xóa sản phẩm khỏi giỏ
  const removeFromCart = (itemId) => {
    setCartItems(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item._id === itemId) {
              if (item.quantity > 1) {
                // Giảm số lượng
                return { ...item, quantity: item.quantity - 1 };
              } else {
                // Xóa sản phẩm nếu số lượng = 1
                return null;
              }
            }
            return item;
          })
          .filter(Boolean), // Loại bỏ null items
    );
  };

  // Lấy tổng số lượng sản phẩm trong giỏ
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Lấy tổng tiền giỏ hàng
  const getCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.offerPrice * item.quantity,
      0,
    );
  };

  // Function để login seller
  const loginSeller = (token) => {
    setSellerToken(token);
    setIsSeller(true);
  };

  // Product management functions for sellers
  const addProduct = async (productData) => {
    try {
      const response = await api.post("/api/product/add", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      throw error;
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await api.get("/api/product/list");
      return response.data.products;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  };

  const toggleProductStock = async (productId) => {
    try {
      const response = await api.post(`/api/product/stock/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái tồn kho:", error);
      throw error;
    }
  };

  const value = {
    addProduct,
    addToCart,
    api, // Axios instance với Bearer token
    // Cart functions
    cartItems,
    formatVND,
    getAllProducts,
    getCartAmount,
    getCartCount,
    isSeller,
    loginSeller,
    logoutSeller,
    navigate,
    removeFromCart,
    searchTerm,
    sellerToken,
    setIsSeller,
    setSearchTerm,
    setUser,
    toggleProductStock,
    updateCart,
    user,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
