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
    <div className="flex-1 h-[95vh] overflow-y-scroll no-scrollbar">
      <div className="space-y-4 p-4 md:p-10">
        <h2 className="font-medium text-lg">Danh sách đơn hàng</h2>

        {/* Header */}
        <div className="gap-4 grid grid-cols-12 bg-gray-50 px-5 py-3 rounded-md font-medium text-gray-600 text-sm">
          <div className="col-span-4">Sản phẩm</div>
          <div className="col-span-3">Địa chỉ</div>
          <div className="col-span-2">Giá</div>
          <div className="col-span-3">Chi tiết thanh toán</div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            orders.map((order) => (
              <div className="space-y-3" key={order._id}>
                {order.items.map((item) => (
                  <div
                    className="gap-4 grid grid-cols-12 hover:shadow-sm p-5 border border-gray-300 rounded-md transition-shadow"
                    key={item._id}
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 col-span-4">
                      <img
                        alt={item.name}
                        className="flex-shrink-0 w-16 h-16 object-cover"
                        src={item.image}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm md:text-base truncate">
                          {item.name}
                        </p>
                        <p className="font-medium text-primary text-sm">
                          SL: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center col-span-3">
                      <div className="text-black/80 text-sm md:text-base break-words">
                        {formatAddress(order.address)}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center col-span-2">
                      <p className="font-medium text-lg">
                        {formatVND(order.amount)}
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div className="flex flex-col justify-center space-y-1 col-span-3 text-black/60 text-sm md:text-base">
                      <p className="font-medium">
                        Phương thức: {order.paymentType}
                      </p>
                      <p>Ngày: {formatDate(order.createdAt)}</p>
                      <p>Thanh toán: {getPaymentStatus(order.isPaid)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
