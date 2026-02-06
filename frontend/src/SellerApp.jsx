import SellerRoutes from "./components/seller/SellerRoutes";

// Component chính cho phần seller của ứng dụng
function SellerApp() {
  return (
    <div className="bg-white min-h-screen text-default text-gray-700">
      <SellerRoutes />
    </div>
  );
}

export default SellerApp;
