import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const ProductCategory = () => {
  const { category } = useParams();
  const { searchTerm } = useAppContext();

  // Lọc sản phẩm theo category, inStock = true và tìm kiếm theo tên
  const filteredProducts = useMemo(() => {
    const categoryProducts = dummyProducts.filter(
      (product) => product.category === category && product.inStock,
    );

    if (searchTerm.trim() === "") {
      return categoryProducts;
    } else {
      return categoryProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }, [category, searchTerm]);

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
