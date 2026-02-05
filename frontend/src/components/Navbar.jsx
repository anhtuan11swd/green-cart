import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { user } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Mock cart count - thay thế bằng logic thực tế
  useEffect(() => {
    // Giả sử lấy từ localStorage hoặc API
    const getCartCount = () => {
      const mockCartCount = localStorage.getItem("cartCount") || 0;
      setCartCount(parseInt(mockCartCount, 10));
    };
    getCartCount();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-50">
      {/* Logo */}
      <Link className="flex items-center" to="/">
        <img
          alt="Green Cart Logo"
          className="cursor-pointer w-34 md:w-38 h-auto"
          src={assets.logo}
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {/* Seller Dashboard Button */}
        <button
          className="border border-gray-300 px-3 py-1 rounded-full text-xs cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          type="button"
        >
          Bảng điều khiển người bán
        </button>

        {/* Navigation Links */}
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

        {/* Search Bar */}
        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full max-lg:hidden bg-white">
          <input
            className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700"
            placeholder="Tìm kiếm sản phẩm"
            type="text"
          />
          <img
            alt="search"
            className="w-4 h-4 cursor-pointer"
            src={assets.search_icon}
          />
        </div>

        {/* Cart Icon */}
        <div className="relative cursor-pointer">
          <Link to="/cart">
            <img
              alt="cart"
              className="w-6 opacity-80 hover:opacity-100 transition-opacity"
              src={assets.cart_icon}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Auth Button */}
        {user ? (
          <div className="flex items-center gap-3">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              src={assets.profile_icon}
            />
            <button
              className="px-6 py-2 bg-primary hover:bg-red-600 transition text-white rounded-full"
              onClick={() => {
                // Logic đăng xuất
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
              className="px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
              type="button"
            >
              Đăng nhập
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4 md:hidden">
        {/* Mobile Cart Icon */}
        <div className="relative cursor-pointer">
          <Link to="/cart">
            <img alt="cart" className="w-6 opacity-80" src={assets.cart_icon} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu} type="button">
          <img alt="menu" className="w-5.5" src={assets.menu_icon} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-300 md:hidden shadow-lg">
          <div className="px-6 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-full bg-white">
              <input
                className="w-full bg-transparent outline-none placeholder-gray-500 text-gray-700 text-sm"
                placeholder="Tìm kiếm sản phẩm"
                type="text"
              />
              <img
                alt="search"
                className="w-4 h-4 cursor-pointer"
                src={assets.search_icon}
              />
            </div>

            {/* Mobile Navigation Links */}
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

            {/* Mobile Seller Dashboard */}
            <button
              className="w-full text-left border border-gray-300 px-3 py-2 rounded-full text-sm opacity-80"
              type="button"
            >
              Bảng điều khiển người bán
            </button>

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                    src={assets.profile_icon}
                  />
                  <span className="text-gray-700">
                    {user.name || "Người dùng"}
                  </span>
                </div>
              ) : (
                <Link onClick={closeMobileMenu} to="/login">
                  <button
                    className="w-full px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
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
