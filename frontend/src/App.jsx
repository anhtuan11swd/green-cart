import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AppContextProvider } from "./context";
import AddAddress from "./pages/AddAddress";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <AppContextProvider>
      <div className="bg-white min-h-screen text-default text-gray-700">
        <Navbar />
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<ProductCategory />} path="/products/:category" />
            <Route element={<Product />} path="/products" />
            <Route element={<ProductDetails />} path="/product/:id" />
            <Route element={<AddAddress />} path="/add-address" />
            <Route element={<Cart />} path="/cart" />
            <Route element={<Login />} path="/login" />
          </Routes>
        </div>
        <Footer />
      </div>
    </AppContextProvider>
  );
}

export default App;
