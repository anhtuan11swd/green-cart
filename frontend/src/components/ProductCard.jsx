import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context";

// Component hiển thị thông tin sản phẩm dạng thẻ với chức năng thêm vào giỏ hàng
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { formatVND, addToCart } = useAppContext();

  const goToProductDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  return (
    <div className="border border-gray-500/20 rounded-md max-w-54 md:px-4 px-3 py-2">
      <button
        aria-label={`Xem chi tiết sản phẩm ${product.name}`}
        className="group cursor-pointer flex items-center justify-center py-2"
        onClick={goToProductDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToProductDetails();
          }
        }}
        type="button"
      >
        <img
          alt={product.name}
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.image[0]}
        />
      </button>
      <div className="text-gray-500/60 text-sm">
        <p>{product.category}</p>
        <button
          aria-label={`Xem chi tiết sản phẩm ${product.name}`}
          className="text-gray-700 font-medium text-lg truncate w-full cursor-pointer hover:text-primary transition-colors text-left"
          onClick={goToProductDetails}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToProductDetails();
            }
          }}
          type="button"
        >
          {product.name}
        </button>
        <div className="flex items-center gap-0.5">
          <img alt="star" className="md:w-3.5 w-3" src={assets.star_icon} />
          <img alt="star" className="md:w-3.5 w-3" src={assets.star_icon} />
          <img alt="star" className="md:w-3.5 w-3" src={assets.star_icon} />
          <img alt="star" className="md:w-3.5 w-3" src={assets.star_icon} />
          <img
            alt="star"
            className="md:w-3.5 w-3"
            src={assets.star_dull_icon}
          />
          <p>(4)</p>
        </div>
        <div className="flex items-end justify-between mt-2">
          <p className="md:text-xl text-base font-medium text-primary">
            {formatVND(product.offerPrice)}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">
              {formatVND(product.price)}
            </span>
          </p>
          <div className="text-primary">
            <button
              className="flex items-center cursor-pointer justify-center gap-1 bg-primary/10 border border-primary/40 px-2 md:w-20 w-16 h-8.5 rounded"
              onClick={handleAddToCart}
              type="button"
            >
              <img alt="cart_icon" className="w-3.5" src={assets.cart_icon} />
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
