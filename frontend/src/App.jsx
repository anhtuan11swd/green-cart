import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";

function App() {
  return (
    <div className="bg-white min-h-screen text-default text-gray-700">
      <Navbar />
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Home />} path="/all-products" />
          <Route element={<Product />} path="/product/:id" />
          <Route element={<Cart />} path="/cart" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
