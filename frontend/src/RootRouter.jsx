import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import { AppContextProvider } from "./context";
import SellerApp from "./SellerApp.jsx";

// Component kiểm tra route hiện tại và render app phù hợp
const RouterContent = () => {
  const location = useLocation();
  // Kiểm tra xem đường dẫn có bắt đầu bằng "/seller" không
  const isSellerRoute = location.pathname.startsWith("/seller");

  return isSellerRoute ? <SellerApp /> : <App />;
};

// Component gốc chứa toàn bộ routing logic của ứng dụng
const RootRouter = () => {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <RouterContent />
      </AppContextProvider>
    </BrowserRouter>
  );
};

export default RootRouter;
