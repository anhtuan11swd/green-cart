import { Outlet } from "react-router-dom";
import Navbar from "../../components/seller/Navbar";
import Sidebar from "../../components/seller/Sidebar";

const SellerLayout = () => {
  return (
    <div className="">
      {/* Navbar phía trên */}
      <Navbar />

      {/* Container chứa Sidebar và nội dung chính */}
      <div className="flex">
        <Sidebar />
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
