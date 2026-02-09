import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context";

// Trang giỏ hàng với chức năng quản lý sản phẩm và đặt hàng
const Cart = () => {
  const {
    navigate,
    formatVND,
    cartItems,
    updateCart,
    removeFromCart,
    clearCart,
    syncCart,
    getCartAmount,
    userToken,
  } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!userToken) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/address/get`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);
          // Chọn địa chỉ đầu tiên mặc định nếu có
          if (data.addresses && data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]._id);
          }
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    loadAddresses();
  }, [userToken]);

  // Tính tổng tiền
  const calculateSubtotal = () => {
    return getCartAmount();
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.02; // 2% thuế
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        addressId: selectedAddress,
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/cod`,
        {
          body: JSON.stringify(orderData),
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        clearCart();
        // Sync cart rỗng với backend
        await syncCart([]);
        toast.success("Đặt hàng thành công!");
        navigate("/orders");
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Có lỗi xảy ra khi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mt-16 pb-16">
          <h1 className="mb-6 font-medium text-3xl">Giỏ hàng</h1>
          <div className="py-16 text-center">
            <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
            <p className="mt-2 text-gray-400">
              Thêm sản phẩm vào giỏ hàng để tiếp tục
            </p>
            <button
              className="bg-primary hover:bg-primary-dull mt-6 px-8 py-3 rounded text-white transition cursor-pointer"
              onClick={() => navigate("/")}
              type="button"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col mt-16">
      {/* Cart Items Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="mb-6 font-medium text-3xl">
          Giỏ hàng{" "}
          <span className="text-primary text-sm">
            {cartItems.length} sản phẩm
          </span>
        </h1>

        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr] pb-3 border-gray-200 border-b font-medium text-gray-500 text-base">
          <p className="text-left">Chi tiết sản phẩm</p>
          <p className="text-center">Thành tiền</p>
          <p className="text-center">Thao tác</p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mt-4">
          {cartItems.map((item, index) => (
            <div
              className="items-center grid grid-cols-[2fr_1fr_1fr] pt-3 pb-4 border-gray-100 border-b font-medium text-sm md:text-base"
              key={item._id || `cart-item-${index}`}
            >
              {/* Product Details */}
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex justify-center items-center border border-gray-300 rounded w-24 h-24 cursor-pointer">
                  <img
                    alt={`Ảnh sản phẩm ${item.name}`}
                    className="rounded max-w-full h-full object-cover"
                    src={item.image?.[0] || "/placeholder-image.jpg"}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <div className="mt-2 font-normal text-gray-500/70">
                    <p>Giá: {formatVND(item.offerPrice)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p>Số lượng:</p>
                      <select
                        className="px-2 py-1 border border-gray-300 rounded outline-none text-sm"
                        onChange={(e) =>
                          updateCart(item._id, parseInt(e.target.value, 10))
                        }
                        value={item.quantity}
                      >
                        {[...Array(9)].map((_, i) => (
                          <option
                            key={`qty-${item._id || `item-${index}`}-${i + 1}`}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <p className="font-semibold text-primary text-center">
                {formatVND(item.offerPrice * item.quantity)}
              </p>

              {/* Remove Button */}
              <div className="text-center">
                <button
                  aria-label="Xóa sản phẩm"
                  className="hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                  onClick={() => removeFromCart(item._id)}
                  type="button"
                >
                  <svg
                    aria-labelledby="remove-icon-title"
                    className="text-red-500"
                    fill="none"
                    height="20"
                    role="img"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title id="remove-icon-title">Xóa sản phẩm</title>
                    <g clipPath="url(#clip0_3523_924)">
                      <path
                        d="M12.4993 7.50033L7.49935 12.5003M7.49935 7.50033L12.4993 12.5003M18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337C5.39698 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39698 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3523_924">
                        <rect fill="white" height="20" width="20" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <button
          className="group flex items-center gap-2 mt-8 font-medium text-primary hover:text-primary-dull transition-colors cursor-pointer"
          onClick={() => navigate("/")}
          type="button"
        >
          <svg
            aria-labelledby="back-arrow-title"
            className="transition-transform group-hover:-translate-x-1"
            fill="none"
            height="11"
            role="img"
            viewBox="0 0 15 11"
            width="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title id="back-arrow-title">Mũi tên quay lại</title>
            <path
              d="M14.0909 5.5H1"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M6.14286 10L1 5.5L6.14286 1"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
          Tiếp tục mua sắm
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 mt-8 md:mt-0 md:ml-8 p-6 rounded-lg w-full max-w-96">
        <h2 className="mb-6 font-medium text-xl md:text-2xl">
          Tóm tắt đơn hàng
        </h2>

        {/* Delivery Address */}
        <div className="mb-6">
          <p className="mb-3 font-medium text-base uppercase">
            Địa chỉ giao hàng
          </p>
          <div className="space-y-3">
            {addresses.length > 0 ? (
              <select
                className="bg-white px-3 py-2 border border-gray-300 focus:border-primary rounded outline-none w-full transition-colors"
                onChange={(e) => setSelectedAddress(e.target.value)}
                value={selectedAddress}
              >
                {addresses.map((address, index) => (
                  <option
                    key={address._id || `address-${index}`}
                    value={address._id}
                  >
                    {address.firstName} {address.lastName}, {address.street},{" "}
                    {address.city}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500">Chưa có địa chỉ</p>
            )}
            <button
              className="text-primary text-sm hover:underline cursor-pointer"
              onClick={() => navigate("/add-address")}
              type="button"
            >
              {addresses.length > 0
                ? "Thêm địa chỉ mới"
                : "Thêm địa chỉ giao hàng"}
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <p className="mb-3 font-medium text-base uppercase">
            Phương thức thanh toán
          </p>
          <select
            className="bg-white px-3 py-2 border border-gray-300 focus:border-primary rounded outline-none w-full transition-colors"
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <option value="COD">Thanh toán khi nhận hàng</option>
            <option value="Online">Thanh toán online</option>
          </select>
        </div>

        <hr className="mb-4 border-gray-300" />

        {/* Price Breakdown */}
        <div className="space-y-2 mb-6 text-gray-600">
          <div className="flex justify-between">
            <span>Tiền hàng</span>
            <span>{formatVND(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>
          <div className="flex justify-between">
            <span>Thuế (2%)</span>
            <span>{formatVND(calculateTax())}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-gray-300 border-t font-semibold text-gray-800 text-lg">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatVND(calculateTotal())}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          className="bg-primary hover:bg-primary-dull disabled:opacity-50 py-3 rounded w-full font-medium text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          disabled={loading || !selectedAddress}
          onClick={handlePlaceOrder}
          type="button"
        >
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
