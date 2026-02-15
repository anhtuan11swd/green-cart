import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const menuItems = [
  {
    activePaths: ["/seller", "/seller/add-product"],
    icon: assets.add_icon,
    label: "Thêm sản phẩm",
    path: "/seller/add-product",
  },
  {
    activePaths: ["/seller/product-list"],
    icon: assets.product_list_icon,
    label: "Danh sách sản phẩm",
    path: "/seller/product-list",
  },
  {
    activePaths: ["/seller/orders"],
    icon: assets.order_icon,
    label: "Đơn hàng",
    path: "/seller/orders",
  },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (paths) => paths.includes(location.pathname);

  return (
    <aside className="w-64 h-[calc(100vh-65px)] bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.activePaths);
          return (
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              data-discover="true"
              key={item.path}
              to={item.path}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${active ? "bg-white/20" : "bg-gray-100 group-hover:bg-primary/10"}`}
              >
                <img
                  alt=""
                  className={`w-5 h-5 ${active ? "invert brightness-0" : ""}`}
                  src={item.icon}
                />
              </div>
              <span className="font-medium text-sm">{item.label}</span>

              {/* Active indicator */}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-600">Seller Dashboard</p>
          <p className="text-xs text-gray-400 mt-1">Quản lý cửa hàng</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
