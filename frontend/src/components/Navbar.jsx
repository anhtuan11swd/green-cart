import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context";

// Component thanh điều hướng chính với chức năng tìm kiếm và menu responsive
const Navbar = () => {
  const { user, searchTerm, setSearchTerm, getCartCount } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getCartCount();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Nếu đang không ở trang products và có từ khóa tìm kiếm, chuyển đến trang products
    if (location.pathname !== "/products" && value.trim() !== "") {
      navigate("/products");
    }
  };

  const navigation = [
    { current: location.pathname === "/", href: "/", name: "Trang chủ" },
    {
      current: location.pathname === "/products",
      href: "/products",
      name: "Tất cả sản phẩm",
    },
  ];

  return (
    <nav className="top-0 z-50 sticky flex justify-between items-center bg-white px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-gray-300 border-b">
      <Link className="flex items-center" to="/">
        <img
          alt="Green Cart Logo"
          className="w-34 md:w-38 h-auto cursor-pointer"
          src={assets.logo}
        />
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <button
          className="opacity-80 hover:opacity-100 px-3 py-1 border border-gray-300 rounded-full text-xs transition-opacity cursor-pointer"
          type="button"
        >
          Bảng điều khiển người bán
        </button>

        <div className="flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              className={`${
                item.current
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              } transition-colors duration-200`}
              key={item.name}
              to={item.href}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="max-lg:hidden flex items-center gap-2 bg-white px-3 py-2 border border-gray-300 rounded-full text-sm">
          <input
            className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
            onChange={handleSearchChange}
            placeholder="Tìm kiếm sản phẩm"
            type="text"
            value={searchTerm}
          />
          <img
            alt="search"
            className="w-4 h-4 cursor-pointer"
            src={assets.search_icon}
          />
        </div>

        <div className="relative cursor-pointer">
          <Link to="/cart">
            <img
              alt="cart"
              className="opacity-80 hover:opacity-100 w-6 transition-opacity"
              src={assets.cart_icon}
            />
            {cartCount > 0 && (
              <span className="-top-2 -right-2 absolute flex justify-center items-center bg-primary rounded-full w-5 h-5 text-white text-xs">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <img
              alt="Profile"
              className="rounded-full w-8 h-8 cursor-pointer"
              src={assets.profile_icon}
            />
            <button
              className="bg-primary hover:bg-red-600 px-6 py-2 rounded-full text-white transition"
              onClick={() => {
                console.log("Đăng xuất");
              }}
              type="button"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button
              className="bg-primary hover:bg-primary-dull px-8 py-2 rounded-full text-white transition"
              type="button"
            >
              Đăng nhập
            </button>
          </Link>
        )}
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div className="relative cursor-pointer">
          <Link to="/cart">
            <img alt="cart" className="opacity-80 w-6" src={assets.cart_icon} />
            {cartCount > 0 && (
              <span className="-top-2 -right-2 absolute flex justify-center items-center bg-primary rounded-full w-4 h-4 text-[10px] text-white text-xs">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        <button className="md:hidden" onClick={toggleMobileMenu} type="button">
          <img alt="menu" className="w-5.5" src={assets.menu_icon} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden top-full right-0 left-0 absolute bg-white shadow-lg border-gray-300 border-b">
          <div className="space-y-4 px-6 py-4">
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-300 rounded-full">
              <input
                className="bg-transparent outline-none w-full text-gray-700 text-sm placeholder-gray-500"
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm"
                type="text"
                value={searchTerm}
              />
              <img
                alt="search"
                className="w-4 h-4 cursor-pointer"
                src={assets.search_icon}
              />
            </div>

            <div className="space-y-3">
              {navigation.map((item) => (
                <Link
                  className={`block py-2 ${
                    item.current ? "text-primary font-medium" : "text-gray-700"
                  }`}
                  key={item.name}
                  onClick={closeMobileMenu}
                  to={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <button
              className="opacity-80 px-3 py-2 border border-gray-300 rounded-full w-full text-sm text-left"
              type="button"
            >
              Bảng điều khiển người bán
            </button>

            <div className="pt-2 border-gray-200 border-t">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    alt="Profile"
                    className="rounded-full w-8 h-8"
                    src={assets.profile_icon}
                  />
                  <span className="text-gray-700">
                    {user.name || "Người dùng"}
                  </span>
                </div>
              ) : (
                <Link onClick={closeMobileMenu} to="/login">
                  <button
                    className="bg-primary hover:bg-primary-dull px-6 py-2 rounded-full w-full text-white transition"
                    type="button"
                  >
                    Đăng nhập
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
