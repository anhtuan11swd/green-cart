import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 py-2 flex flex-col">
      <Link
        className={`flex items-center py-3 px-4 gap-3 ${
          location.pathname === "/seller" ||
          location.pathname === "/seller/add-product"
            ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary"
            : "hover:bg-gray-100/90 border-white"
        }`}
        data-discover="true"
        to="/seller/add-product"
      >
        <img alt="" className="w-7 h-7" src={assets.add_icon} />
        <p className="md:block hidden text-center">Thêm sản phẩm</p>
      </Link>
      <Link
        className={`flex items-center py-3 px-4 gap-3 ${
          location.pathname === "/seller/product-list"
            ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary"
            : "hover:bg-gray-100/90 border-white"
        }`}
        data-discover="true"
        to="/seller/product-list"
      >
        <img alt="" className="w-7 h-7" src={assets.product_list_icon} />
        <p className="md:block hidden text-center">Danh sách sản phẩm</p>
      </Link>
      <Link
        className={`flex items-center py-3 px-4 gap-3 ${
          location.pathname === "/seller/orders"
            ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary"
            : "hover:bg-gray-100/90 border-white"
        }`}
        data-discover="true"
        to="/seller/orders"
      >
        <img alt="" className="w-7 h-7" src={assets.order_icon} />
        <p className="md:block hidden text-center">Đơn hàng</p>
      </Link>
    </div>
  );
};

export default Sidebar;
