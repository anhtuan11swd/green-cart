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
      <div className="flex-1 h-[calc(100vh-65px)] overflow-y-auto bg-gray-50">
        <div className="p-4 md:p-8">
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-65px)] overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tất cả sản phẩm
            </h2>
            <p className="text-gray-500 mt-1">
              Quản lý và cập nhật sản phẩm của bạn
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-primary">
              {products.length}
            </span>{" "}
            sản phẩm
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm hidden md:table-cell">
                    Giá bán
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">
                    Còn hàng
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td className="px-6 py-16 text-center" colSpan="4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg
                            aria-label="Không có sản phẩm"
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            role="img"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <title>Không có sản phẩm</title>
                            <path
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          Chưa có sản phẩm nào
                        </p>
                        <p className="text-gray-400 text-sm">
                          Hãy thêm sản phẩm đầu tiên của bạn
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      className="hover:bg-gray-50/50 transition-colors"
                      key={product._id}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            <img
                              alt={`${product.name} sản phẩm`}
                              className="w-full h-full object-cover"
                              src={product.image[0]}
                            />
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-semibold text-gray-900">
                          {formatVND(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              checked={product.inStock}
                              className="sr-only peer"
                              disabled={togglingStock === product._id}
                              onChange={() => handleToggleStock(product._id)}
                              type="checkbox"
                            />
                            <div
                              className={`w-12 h-7 rounded-full transition-all duration-200 ${
                                product.inStock ? "bg-primary" : "bg-gray-300"
                              } ${togglingStock === product._id ? "opacity-50" : ""} peer-focus:ring-2 peer-focus:ring-primary/30`}
                            ></div>
                            <span
                              className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                                product.inStock ? "translate-x-5" : ""
                              }`}
                            ></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {products.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Hiển thị {products.length} sản phẩm</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-medium">
                    {products.filter((p) => p.inStock).length} còn hàng
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    {products.filter((p) => !p.inStock).length} hết hàng
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
