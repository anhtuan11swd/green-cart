import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import AddProduct from "../../pages/seller/AddProduct";
import Orders from "../../pages/seller/Orders";
import ProductList from "../../pages/seller/ProductList";
import SellerLayout from "../../pages/seller/SellerLayout";
import SellerLogin from "./SellerLogin";

// Component quản lý routing cho seller panel
const SellerRoutes = () => {
  const { isSeller } = useContext(AppContext);

  // Hiển thị trang đăng nhập nếu chưa đăng nhập
  if (!isSeller) {
    return <SellerLogin />;
  }

  return (
    <Routes>
      <Route element={<SellerLayout />} path="/seller">
        <Route element={<AddProduct />} index />
        <Route element={<AddProduct />} path="add-product" />
        <Route element={<ProductList />} path="product-list" />
        <Route element={<Orders />} path="orders" />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
