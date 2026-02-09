import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const ProductCategory = () => {
  const { category } = useParams();
  const { searchTerm, getAllProducts } = useAppContext();
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
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getAllProducts]);

  // Lọc sản phẩm theo category, inStock = true và tìm kiếm theo tên
  const filteredProducts = useMemo(() => {
    const categoryProducts = products.filter(
      (product) => product.category === category && product.inStock,
    );

    if (searchTerm.trim() === "") {
      return categoryProducts;
    } else {
      return categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }, [products, category, searchTerm]);

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex flex-col mt-16">
        <div className="flex flex-col items-end w-max">
          <p className="font-medium text-2xl uppercase">{category}</p>
          <div className="bg-primary rounded-full w-16 h-0.5"></div>
        </div>
        <div className="flex justify-center items-center min-h-96 mt-6">
          <div className="text-center">
            <div className="mx-auto border-primary border-b-2 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex flex-col mt-16">
        <div className="flex flex-col items-end w-max">
          <p className="font-medium text-2xl uppercase">{category}</p>
          <div className="bg-primary rounded-full w-16 h-0.5"></div>
        </div>
        <div className="flex justify-center items-center min-h-96 mt-6">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              className="mt-4 bg-primary hover:bg-primary-dull px-6 py-2 text-white rounded transition-colors"
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

  return (
    <div className="flex flex-col mt-16">
      <div className="flex flex-col items-end w-max">
        <p className="font-medium text-2xl uppercase">{category}</p>
        <div className="bg-primary rounded-full w-16 h-0.5"></div>
      </div>

      <div className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
