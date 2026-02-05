import { dummyProducts } from "../assets/assets";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const bestSellers = dummyProducts
    .filter((product) => product.inStock)
    .slice(0, 5);

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
