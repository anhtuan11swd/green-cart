import { useEffect, useState } from "react";
import { useAppContext } from "../context";

// Trang hiển thị danh sách đơn hàng của người dùng
const MyOrders = () => {
  const { formatVND } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/order/user-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          console.error("Không thể tải danh sách đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mt-16 pb-16">
          <div className="flex flex-col items-end w-max mb-8">
            <p className="text-2xl font-medium uppercase">Đơn hàng của tôi</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-500">Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mt-16 pb-16">
          <div className="flex flex-col items-end w-max mb-8">
            <p className="text-2xl font-medium uppercase">Đơn hàng của tôi</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</p>
            <p className="mt-2 text-gray-400">
              Hãy mua sắm và đặt hàng để xem đơn hàng tại đây
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="mt-16 pb-16">
        <div className="flex flex-col items-end w-max mb-8">
          <p className="text-2xl font-medium uppercase">Đơn hàng của tôi</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
              key={order._id}
            >
              <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col mb-4">
                <span className="truncate">Mã đơn hàng : {order._id}</span>
                <span>Thanh toán : {order.paymentMethod}</span>
                <span>Tổng tiền : {formatVND(order.total)}</span>
              </p>

              {order.items.map((item, index) => (
                <div
                  className="relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl"
                  key={`${order._id}-${index}`}
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <img
                        alt={`Ảnh sản phẩm ${item.product?.name || "Sản phẩm"}`}
                        className="w-16 h-16"
                        src={item.product?.image?.[0] || ""}
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-800">
                        {item.product?.name || "Sản phẩm"}
                      </h2>
                      <p>Danh mục: {item.product?.category || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                    <p>Số lượng: {item.quantity}</p>
                    <p>Trạng thái: {order.status || "Đã đặt hàng"}</p>
                    <p>
                      Ngày:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <p className="text-primary text-lg font-medium">
                    Thành tiền: {formatVND(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
