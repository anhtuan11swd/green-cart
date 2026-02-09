import { useEffect, useState } from "react";
import { useAppContext } from "../context";

// Trang hiển thị danh sách đơn hàng của người dùng
const MyOrders = () => {
  const { api, formatVND } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get("/api/order/user");

        if (response.data.success) {
          setOrders(response.data.orders || []);
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
  }, [api]);

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mt-16 pb-16">
          <div className="flex flex-col items-end mb-8 w-max">
            <p className="font-medium text-2xl uppercase">Đơn hàng của tôi</p>
            <div className="bg-primary rounded-full w-16 h-0.5"></div>
          </div>
          <div className="py-16 text-center">
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
          <div className="flex flex-col items-end mb-8 w-max">
            <p className="font-medium text-2xl uppercase">Đơn hàng của tôi</p>
            <div className="bg-primary rounded-full w-16 h-0.5"></div>
          </div>
          <div className="py-16 text-center">
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
        <div className="flex flex-col items-end mb-8 w-max">
          <p className="font-medium text-2xl uppercase">Đơn hàng của tôi</p>
          <div className="bg-primary rounded-full w-16 h-0.5"></div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              className="mb-10 p-4 py-5 border border-gray-300 rounded-lg max-w-4xl"
              key={order._id}
            >
              <p className="flex max-md:flex-col justify-between md:items-center mb-4 md:font-medium text-gray-400">
                <span className="truncate">Mã đơn hàng : {order._id}</span>
                <span>Thanh toán : {order.paymentType}</span>
                <span>Tổng tiền : {formatVND(order.amount)}</span>
              </p>

              {order.items.map((item, index) => (
                <div
                  className="relative flex md:flex-row flex-col justify-between md:items-center md:gap-16 bg-white p-4 py-5 border-gray-300 w-full max-w-4xl text-gray-500/70"
                  key={`${order._id}-${index}`}
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      {item.image ? (
                        <img
                          alt={`Ảnh sản phẩm ${item.name || "Sản phẩm"}`}
                          className="rounded w-16 h-16 object-cover"
                          src={item.image}
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-gray-200 rounded w-16 h-16">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h2 className="font-medium text-gray-800 text-xl">
                        {item.name || "Sản phẩm"}
                      </h2>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center mb-4 md:mb-0 md:ml-8">
                    <p>Số lượng: {item.quantity}</p>
                    <p>Trạng thái: {order.status || "Đã đặt hàng"}</p>
                    <p>
                      Ngày:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <p className="font-medium text-primary text-lg">
                    Thành tiền:{" "}
                    {formatVND((item.offerPrice || item.price) * item.quantity)}
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
