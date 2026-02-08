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
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
      <a data-discover="true" href="/">
        <img
          alt="Logo"
          className="cursor-pointer w-34 md:w-38"
          src={assets.logo}
        />
      </a>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Xin chào! Quản trị viên</p>
        <button
          className={`border rounded-full text-sm px-4 py-1 transition-colors ${
            isLoggingOut
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50 cursor-pointer"
          }`}
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? "ĐANG ĐĂNG XUẤT..." : "ĐĂNG XUẤT"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
