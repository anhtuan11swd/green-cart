import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { formatVND } = useAppContext();

  const goToProductDetails = () => {
    navigate(`/product/${product._id}`);
  };

  // Quản lý việc thêm sản phẩm vào giỏ hàng với localStorage
  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProductIndex = currentCart.findIndex(
      (item) => item._id === product._id,
    );

    if (existingProductIndex >= 0) {
      currentCart[existingProductIndex].quantity += 1;
    } else {
      currentCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));

    const totalItems = currentCart.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    localStorage.setItem("cartCount", totalItems.toString());

    window.dispatchEvent(new Event("cartUpdated"));
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
              onClick={addToCart}
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
