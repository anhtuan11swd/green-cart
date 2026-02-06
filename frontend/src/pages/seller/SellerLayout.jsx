import { Outlet } from "react-router-dom";
import Navbar from "../../components/seller/Navbar";
import Sidebar from "../../components/seller/Sidebar";

const SellerLayout = () => {
  return (
    <div>
      {/* Navbar phía trên */}
      <Navbar />

      {/* Container chứa Sidebar và nội dung chính */}
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
