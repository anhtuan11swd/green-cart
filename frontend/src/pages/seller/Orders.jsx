import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const Orders = () => {
  const { formatVND, api } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/order/seller");
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          const errorMessage = "Không thể tải danh sách đơn hàng";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);

        if (err.response?.status === 401) {
          const errorMessage = "Vui lòng đăng nhập seller";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          const errorMessage =
            err.response?.data?.message || "Lỗi khi tải danh sách đơn hàng";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [api]);

  // Hàm định dạng ngày tháng theo chuẩn Việt Nam
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Hàm định dạng địa chỉ
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  // Hàm lấy trạng thái thanh toán
  const getPaymentStatus = (isPaid) => {
    return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
  };

  return (
    <div className="flex-1 h-[calc(100vh-65px)] overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách đơn hàng
          </h2>
          <p className="text-gray-500 mt-1">
            Quản lý và theo dõi các đơn hàng của bạn
          </p>
        </div>

        {/* Orders Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 bg-gray-50 px-5 py-4 border-b border-gray-100">
            <div className="col-span-4 font-semibold text-gray-700 text-sm">
              Sản phẩm
            </div>
            <div className="col-span-3 font-semibold text-gray-700 text-sm">
              Địa chỉ
            </div>
            <div className="col-span-2 font-semibold text-gray-700 text-sm">
              Giá
            </div>
            <div className="col-span-3 font-semibold text-gray-700 text-sm">
              Chi tiết thanh toán
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-gray-500">
                    Đang tải danh sách đơn hàng...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      aria-label="Lỗi"
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Lỗi</title>
                      <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      aria-label="Không có đơn hàng"
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Không có đơn hàng</title>
                      <path
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">
                    Chưa có đơn hàng nào
                  </p>
                  <p className="text-gray-400 text-sm">
                    Đơn hàng sẽ xuất hiện tại đây khi có khách đặt mua
                  </p>
                </div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id}>
                  {order.items.map((item) => (
                    <div
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 hover:bg-gray-50/50 transition-colors"
                      key={item._id}
                    >
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover"
                            src={item.image}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {item.name}
                          </p>
                          <p className="font-medium text-primary text-sm">
                            SL: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-span-1 md:col-span-3 flex items-center">
                        <div className="text-gray-600 text-sm break-words">
                          {formatAddress(order.address)}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 md:col-span-2 flex items-center">
                        <p className="font-bold text-lg text-gray-900">
                          {formatVND(
                            (item.offerPrice || item.price) * item.quantity,
                          )}
                        </p>
                      </div>

                      {/* Payment Details */}
                      <div className="col-span-1 md:col-span-3 flex flex-col justify-center gap-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg
                            aria-label="Thanh toán"
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            role="img"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>Thanh toán</title>
                            <path
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <span>{order.paymentType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            aria-label="Ngày đặt hàng"
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            role="img"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>Ngày đặt hàng</title>
                            <path
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                            order.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? "bg-green-500" : "bg-yellow-500"}`}
                          ></span>
                          {getPaymentStatus(order.isPaid)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Table Footer - Stats */}
          {!loading && !error && orders.length > 0 && (
            <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Hiển thị {orders.length} đơn hàng</span>
                <span className="font-medium">
                  Tổng:{" "}
                  {formatVND(
                    orders.reduce(
                      (sum, order) =>
                        sum +
                        order.items.reduce(
                          (itemSum, item) =>
                            itemSum +
                            (item.offerPrice || item.price) * item.quantity,
                          0,
                        ),
                      0,
                    ),
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
