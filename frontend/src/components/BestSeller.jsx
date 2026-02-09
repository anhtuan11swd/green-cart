import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const { getAllProducts } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm bán chạy:", err);
        setError("Không thể tải sản phẩm bán chạy. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getAllProducts]);

  // Tính toán sản phẩm bán chạy (lấy 5 sản phẩm đầu tiên có inStock = true)
  const bestSellers = useMemo(() => {
    return products.filter((product) => product.inStock).slice(0, 5);
  }, [products]);

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="mt-16">
        <p className="text-2xl md:text-3xl font-medium">Sản phẩm bán chạy</p>
        <div className="flex justify-center items-center min-h-48 mt-6">
          <div className="text-center">
            <div className="mx-auto border-primary border-b-2 rounded-full w-8 h-8 animate-spin"></div>
            <p className="mt-2 text-gray-600 text-sm">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="mt-16">
        <p className="text-2xl md:text-3xl font-medium">Sản phẩm bán chạy</p>
        <div className="flex justify-center items-center min-h-48 mt-6">
          <div className="text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              className="mt-2 bg-primary hover:bg-primary-dull px-4 py-1.5 text-white rounded text-sm transition-colors"
              onClick={() => window.location.reload()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Không hiển thị gì nếu không có sản phẩm bán chạy
  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Sản phẩm bán chạy</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
