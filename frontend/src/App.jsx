import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";

function App() {
  return (
    <div className="bg-white min-h-screen text-default text-gray-700">
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Home />} path="/all-products" />
        <Route element={<Product />} path="/product/:id" />
        <Route element={<Cart />} path="/cart" />
        <Route element={<Login />} path="/login" />
      </Routes>
    </div>
  );
}

export default App;
