import { Outlet } from "react-router-dom";
import Navbar from "../../components/seller/Navbar";
import Sidebar from "../../components/seller/Sidebar";

const SellerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar phía trên */}
      <Navbar />

      {/* Container chứa Sidebar và nội dung chính */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
