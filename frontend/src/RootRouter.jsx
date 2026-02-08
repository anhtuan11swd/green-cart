import { Toaster } from "react-hot-toast";
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 500,
            error: {
              duration: 500,
              theme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 500,
              theme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
          }}
        />
      </AppContextProvider>
    </BrowserRouter>
  );
};

export default RootRouter;
