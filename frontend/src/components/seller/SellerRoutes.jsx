import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import AddProduct from "../../pages/seller/AddProduct";
import Orders from "../../pages/seller/Orders";
import ProductList from "../../pages/seller/ProductList";
import SellerLayout from "../../pages/seller/SellerLayout";
import SellerLogin from "./SellerLogin";

// Component quản lý routing cho seller panel với nested routes
const SellerRoutes = () => {
  const { isSeller } = useContext(AppContext);

  // Hiển thị trang đăng nhập nếu chưa đăng nhập
  if (!isSeller) {
    return <SellerLogin />;
  }

  return (
    <Routes>
      {/* Route cha chứa toàn bộ seller panel */}
      <Route
        element={
          <SellerLayout>
            {/* Nested routes bên trong layout */}
            <Routes>
              <Route element={<AddProduct />} index />
              <Route element={<ProductList />} path="product-list" />
              <Route element={<Orders />} path="orders" />
            </Routes>
          </SellerLayout>
        }
        path="/*"
      />
    </Routes>
  );
};

export default SellerRoutes;
