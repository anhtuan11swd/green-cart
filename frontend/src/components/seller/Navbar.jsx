import { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { setIsSeller, navigate } = useContext(AppContext);

  const handleLogout = () => {
    setIsSeller(false);
    navigate("/");
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
          className="border rounded-full text-sm px-4 py-1 hover:bg-gray-50 transition-colors"
          onClick={handleLogout}
          type="button"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Navbar;
