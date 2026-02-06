import { useContext } from "react";
import { dummyOrders } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Orders = () => {
  const { formatVND } = useContext(AppContext);

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
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 rounded-md font-medium text-sm text-gray-600">
          <div className="col-span-4">Sản phẩm</div>
          <div className="col-span-3">Địa chỉ</div>
          <div className="col-span-2">Giá</div>
          <div className="col-span-3">Chi tiết thanh toán</div>
        </div>

        <div className="space-y-4">
          {dummyOrders.map((order) => (
            <div className="space-y-3" key={order._id}>
              {order.items.map((item) => (
                <div
                  className="grid grid-cols-12 gap-4 p-5 rounded-md border border-gray-300 hover:shadow-sm transition-shadow"
                  key={item._id}
                >
                  {/* Product Info */}
                  <div className="col-span-4 flex gap-4 items-center">
                    <img
                      alt="box_icon"
                      className="w-16 h-16 object-cover flex-shrink-0"
                      src="/assets/box_icon-eJIAYJwb.svg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">
                        {item.product.name}
                      </p>
                      <p className="text-primary text-sm font-medium">
                        SL: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-span-3 flex items-center">
                    <div className="text-sm md:text-base text-black/80 break-words">
                      {formatAddress(order.address)}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center">
                    <p className="font-medium text-lg">
                      {formatVND(order.amount)}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="col-span-3 flex flex-col justify-center text-sm md:text-base text-black/60 space-y-1">
                    <p className="font-medium">
                      Phương thức: {order.paymentType}
                    </p>
                    <p>Ngày: {formatDate(order.createdAt)}</p>
                    <p>Thanh toán: {getPaymentStatus(order.isPaid)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
