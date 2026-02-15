import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { api, logoutSeller, navigate } = useContext(AppContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await api.get("/api/seller/logout");

      if (response.data.success) {
        toast.success(response.data.message);
        logoutSeller();
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng xuất thất bại";
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <a className="flex items-center" data-discover="true" href="/">
          <img
            alt="GreenCart Logo"
            className="h-10 md:h-12 cursor-pointer transition-transform hover:scale-105"
            src={assets.logo}
          />
        </a>

        <div className="flex items-center gap-4">
          {/* Welcome Message */}
          <div className="hidden md:flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Xin chào! Quản trị viên</span>
          </div>

          {/* Logout Button */}
          <button
            className={`flex items-center gap-2 border rounded-lg text-sm px-4 py-2.5 transition-all duration-200 ${
              isLoggingOut
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:bg-red-50 hover:border-red-200 hover:text-red-600 cursor-pointer bg-white"
            }`}
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? (
              <>
                <svg
                  aria-hidden="true"
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    fill="none"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                <span>ĐANG ĐĂNG XUẤT...</span>
              </>
            ) : (
              <>
                <svg
                  aria-label="Đăng xuất"
                  className="w-4 h-4"
                  fill="none"
                  role="img"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Đăng xuất</title>
                  <path
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span className="hidden sm:inline">ĐĂNG XUẤT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
