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
    // Ưu tiên userToken, nếu không có thì dùng sellerToken
    const userToken = localStorage.getItem("userToken");
    const sellerToken = localStorage.getItem("sellerToken");

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (sellerToken) {
      config.headers.Authorization = sellerToken;
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
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });
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

  // Lưu userToken vào localStorage khi thay đổi
  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [userToken]);

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

  // Sync cart với backend
  const syncCart = useCallback(
    async (items) => {
      try {
        if (!userToken) return;

        const cartData = items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        }));

        const response = await api.post("/api/user/cart/update", {
          cartItems: cartData,
        });

        return response.data;
      } catch (error) {
        console.error("Lỗi khi đồng bộ giỏ hàng:", error);
        throw error;
      }
    },
    [userToken],
  );

  // Sync cart với backend khi cartItems thay đổi và có userToken
  useEffect(() => {
    const syncCartWithBackend = async () => {
      try {
        if (userToken && cartItems.length >= 0) {
          await syncCart(cartItems);
        }
      } catch (error) {
        console.error("Lỗi đồng bộ cart với backend:", error);
        // Không throw error để tránh crash app
      }
    };

    // Debounce sync để tránh gọi API quá nhiều lần
    const timeoutId = setTimeout(syncCartWithBackend, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems, userToken, syncCart]);

  // Lưu isSeller state vào localStorage
  useEffect(() => {
    localStorage.setItem("isSeller", JSON.stringify(isSeller));
  }, [isSeller]);

  // Load cart từ user data (DB format) và convert sang frontend format
  const loadCartFromUserData = useCallback(async (userCartItems) => {
    try {
      if (!userCartItems || userCartItems.length === 0) {
        setCartItems([]);
        return;
      }

      const convertedCartItems = userCartItems
        .map((item) => {
          const product = item.product;

          if (!product || typeof product !== "object") {
            console.warn("Invalid cart item - product not populated:", item);
            return null;
          }

          if (!product._id) {
            console.warn("Invalid cart item - missing product ID:", item);
            return null;
          }

          return {
            _id: product._id,
            category: product.category,
            image: product.image,
            name: product.name,
            offerPrice: product.offerPrice,
            quantity: item.quantity || 1,
          };
        })
        .filter((item) => item !== null);

      setCartItems(convertedCartItems);
    } catch (error) {
      console.error("Lỗi khi load cart từ user data:", error);
      setCartItems([]);
    }
  }, []);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!userToken) return;

        const response = await api.get("/api/user/is-auth", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const { user } = response.data;
        setUser(user);

        // Load cart từ user data khi app startup
        if (user.cartItems && user.cartItems.length > 0) {
          await loadCartFromUserData(user.cartItems);
        }
      } catch (error) {
        console.error("Lỗi kiểm tra authentication:", error);
        // Nếu token không hợp lệ, clear user data
        setUserToken(null);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, [userToken, loadCartFromUserData]);

  // Function để logout seller
  const logoutSeller = useCallback(() => {
    setSellerToken(null);
    setIsSeller(false);
  }, []);

  // Function để login user
  const loginUser = useCallback(
    async (email, password) => {
      try {
        const response = await api.post("/api/user/login", { email, password });
        const { token, user } = response.data;
        setUserToken(token);
        setUser(user);

        // Load cart từ user data sau khi login
        if (user.cartItems && user.cartItems.length > 0) {
          await loadCartFromUserData(user.cartItems);
        } else {
          // Nếu user chưa có cart, giữ cart local hiện tại
          // Không cần làm gì vì cartItems đã có từ localStorage
        }

        return { success: true };
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error;
      }
    },
    [loadCartFromUserData],
  );

  // Function để register user
  const registerUser = useCallback(async (name, email, password) => {
    try {
      const response = await api.post("/api/user/register", {
        email,
        name,
        password,
      });
      const { token, user } = response.data;
      setUserToken(token);
      setUser(user);

      // User mới đăng ký chưa có cart, giữ cart local hiện tại
      // Cart sẽ được sync lên DB qua useEffect sau

      return { success: true };
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  }, []);

  // Function để logout user
  const logoutUser = useCallback(async () => {
    try {
      await api.get("/api/user/logout");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      setUserToken(null);
      setUser(null);
      // Clear cart khi logout
      setCartItems([]);
    }
  }, []);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    try {
      const response = await api.get(`/api/product/${itemId}`);
      const product = response.data.product || response.data;

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

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
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

  const getProductById = async (productId) => {
    try {
      const response = await api.get(`/api/product/${productId}`);
      return response.data.product;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
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
    clearCart,
    formatVND,
    getAllProducts,
    getCartAmount,
    getCartCount,
    getProductById,
    isSeller,
    loadCartFromUserData,
    loginSeller,
    loginUser,
    logoutSeller,
    logoutUser,
    navigate,
    registerUser,
    removeFromCart,
    searchTerm,
    sellerToken,
    setIsSeller,
    setSearchTerm,
    setUser,
    syncCart,
    toggleProductStock,
    updateCart,
    user,
    userToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
