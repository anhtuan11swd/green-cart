import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const ProductList = () => {
  const { formatVND, getAllProducts, toggleProductStock } =
    useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingStock, setTogglingStock] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [getAllProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleToggleStock = async (productId) => {
    try {
      setTogglingStock(productId);
      const response = await toggleProductStock(productId);

      // Cập nhật trạng thái local
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, inStock: !product.inStock }
            : product,
        ),
      );

      toast.success(response.message);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái tồn kho:", error);
      toast.error("Không thể cập nhật trạng thái tồn kho");
    } finally {
      setTogglingStock(null);
    }
  };

  if (loading) {
    return (
      <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">Tất cả sản phẩm</h2>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">Tất cả sản phẩm</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Sản phẩm</th>
                <th className="px-4 py-3 font-semibold truncate">Danh mục</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Giá bán
                </th>
                <th className="px-4 py-3 font-semibold truncate">Còn hàng</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-gray-500"
                    colSpan="4"
                  >
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr className="border-t border-gray-500/20" key={product._id}>
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded p-2">
                        <img
                          alt={`${product.name} sản phẩm`}
                          className="w-16"
                          src={product.image[0]}
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {formatVND(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          checked={product.inStock}
                          className="sr-only peer"
                          disabled={togglingStock === product._id}
                          onChange={() => handleToggleStock(product._id)}
                          type="checkbox"
                        />
                        <div
                          className={`w-12 h-7 rounded-full transition-colors duration-200 ${
                            product.inStock ? "bg-blue-600" : "bg-slate-300"
                          } ${togglingStock === product._id ? "opacity-50" : ""}`}
                        ></div>
                        <span
                          className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                            product.inStock ? "translate-x-5" : ""
                          }`}
                        ></span>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
