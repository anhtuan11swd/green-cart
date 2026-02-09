import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

// Trang chi tiết sản phẩm với gallery ảnh và sản phẩm liên quan
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatVND, addToCart, getProductById, getAllProducts } =
    useAppContext();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  // Gọi API để lấy tất cả sản phẩm (cho sản phẩm liên quan)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      }
    };

    fetchAllProducts();
  }, [getAllProducts]);

  // Gọi API để lấy chi tiết sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const foundProduct = await getProductById(id);
        setProduct(foundProduct);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        // Nếu không tìm thấy sản phẩm, chuyển về trang chủ
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate, getProductById]);

  // Tính toán sản phẩm liên quan dựa trên sản phẩm hiện tại
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(
        (p) =>
          p.category === product.category && p._id !== product._id && p.inStock,
      )
      .slice(0, 5);
  }, [product, allProducts]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product._id);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
    }
  };

  const buyNow = async () => {
    // Thêm vào giỏ và chuyển đến trang thanh toán
    try {
      await addToCart(product._id);
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="mx-auto border-primary border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
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
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm</p>
          <p className="text-sm text-gray-500 mt-2">
            Đang chuyển về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="mb-6">
        <button
          className="text-primary hover:text-primary-dull transition-colors cursor-pointer"
          onClick={() => navigate("/")}
          type="button"
        >
          Trang chủ
        </button>{" "}
        /{" "}
        <button
          className="text-primary hover:text-primary-dull transition-colors cursor-pointer"
          onClick={() => navigate("/products")}
          type="button"
        >
          Sản phẩm
        </button>{" "}
        /{" "}
        <button
          className="text-primary hover:text-primary-dull transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${product.category}`)}
          type="button"
        >
          {product.category}
        </button>{" "}
        / <span className="font-medium text-primary">{product.name}</span>
      </div>

      <div className="flex md:flex-row flex-col gap-16">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.image.map((img, index) => (
              <button
                aria-label={`Xem ảnh ${index + 1} của ${product.name}`}
                className={`border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer transition-all ${
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                key={`thumbnail-${product._id}-${index}`}
                onClick={() => setSelectedImageIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedImageIndex(index);
                  }
                }}
                type="button"
              >
                <img
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  src={img}
                />
              </button>
            ))}
          </div>

          <div className="border border-gray-500/30 rounded max-w-100 overflow-hidden">
            <img
              alt={`Sản phẩm chính - ${product.name}`}
              className="w-full h-full object-cover"
              src={product.image[selectedImageIndex]}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 text-sm">
          <h1 className="font-medium text-3xl">{product.name}</h1>

          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4].map((star) => (
              <img
                alt="star"
                className="w-3.5 md:w-4"
                key={star}
                src={assets.star_icon}
              />
            ))}
            <img
              alt="star"
              className="w-3.5 md:w-4"
              src={assets.star_dull_icon}
            />
            <p className="ml-2 text-base">(4)</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">
              Giá niêm yết: {formatVND(product.price)}
            </p>
            <p className="font-medium text-2xl">
              Giá niêm yết: {formatVND(product.offerPrice)}
            </p>
            <span className="text-gray-500/70">(bao gồm tất cả thuế)</span>
          </div>

          <p className="mt-6 font-medium text-base">Mô tả sản phẩm</p>
          <ul className="ml-4 text-gray-500/70 list-disc">
            {product.description.map((desc, index) => (
              <li key={`desc-${product._id}-${index}`}>{desc}</li>
            ))}
          </ul>

          <div className="flex items-center gap-4 mt-10 text-base">
            <button
              className="bg-gray-100 hover:bg-gray-200 py-3.5 w-full font-medium text-gray-800/80 transition-colors cursor-pointer"
              onClick={handleAddToCart}
              type="button"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              className="bg-primary hover:bg-primary-dull py-3.5 w-full font-medium text-white transition-colors cursor-pointer"
              onClick={buyNow}
              type="button"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="font-medium text-3xl">Sản phẩm liên quan</p>
          <div className="bg-primary mt-2 rounded-full w-20 h-0.5"></div>
        </div>

        <div className="gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 w-full">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct._id} product={relatedProduct} />
          ))}
        </div>

        {relatedProducts.length >= 5 && (
          <button
            className="hover:bg-primary mx-auto my-16 px-12 py-2.5 border border-primary rounded text-primary hover:text-white transition-colors cursor-pointer"
            onClick={() =>
              navigate(`/products/${product.category.toLowerCase()}`)
            }
            type="button"
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
