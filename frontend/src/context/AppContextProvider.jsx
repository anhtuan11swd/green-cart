import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

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
  const [isSeller, setIsSeller] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    // Cập nhật cart count
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("cartCount", totalCount.toString());
    // Dispatch event để các component khác cập nhật
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${itemId}`,
      );
      if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm");

      const product = await response.json();

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

  const value = {
    addToCart,
    // Cart functions
    cartItems,
    formatVND,
    getCartAmount,
    getCartCount,
    isSeller,
    navigate,
    removeFromCart,
    searchTerm,
    setIsSeller,
    setSearchTerm,
    setUser,
    updateCart,
    user,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
