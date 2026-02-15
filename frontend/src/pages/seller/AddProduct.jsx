import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { assets, categories } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const AddProduct = () => {
  const { formatVND, addProduct, navigate } = useContext(AppContext);

  const [files, setFiles] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  // State cho validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm format giá để hiển thị (string)
  const formatPriceDisplay = (priceValue) => {
    if (!priceValue || Number.isNaN(Number(priceValue))) return "";
    return formatVND(Number(priceValue));
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [`image${index}`]: "Chỉ chấp nhận file JPG, PNG, hoặc WebP",
        }));
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          [`image${index}`]: "Kích thước file không được vượt quá 5MB",
        }));
        return;
      }

      // Xóa lỗi nếu hợp lệ
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`image${index}`];
        return newErrors;
      });

      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }
  };

  // Hàm validation form
  const validateForm = () => {
    const newErrors = {};

    // Validation tên sản phẩm
    if (!name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    } else if (name.trim().length < 3) {
      newErrors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    } else if (name.trim().length > 100) {
      newErrors.name = "Tên sản phẩm không được vượt quá 100 ký tự";
    }

    // Validation mô tả
    if (!description.trim()) {
      newErrors.description = "Mô tả sản phẩm không được để trống";
    } else if (description.trim().length < 10) {
      newErrors.description = "Mô tả sản phẩm phải có ít nhất 10 ký tự";
    }

    // Validation danh mục
    if (!category) {
      newErrors.category = "Vui lòng chọn danh mục sản phẩm";
    }

    // Validation giá gốc
    const priceNum = Number(price);
    if (!price || priceNum <= 0) {
      newErrors.price = "Giá gốc phải là số dương lớn hơn 0";
    } else if (Number.isNaN(priceNum)) {
      newErrors.price = "Giá gốc phải là số hợp lệ";
    }

    // Validation giá khuyến mãi
    const offerPriceNum = Number(offerPrice);
    if (!offerPrice || offerPriceNum <= 0) {
      newErrors.offerPrice = "Giá khuyến mãi phải là số dương lớn hơn 0";
    } else if (Number.isNaN(offerPriceNum)) {
      newErrors.offerPrice = "Giá khuyến mãi phải là số hợp lệ";
    } else if (offerPriceNum > priceNum) {
      newErrors.offerPrice = "Giá khuyến mãi không được lớn hơn giá gốc";
    }

    // Validation hình ảnh
    const hasImage = files.some((file) => file !== null);
    if (!hasImage) {
      newErrors.images = "Vui lòng upload ít nhất 1 hình ảnh sản phẩm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());

      // Convert description từ string thành array (tách theo dòng)
      const descriptionArray = description
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      formData.append("description", JSON.stringify(descriptionArray));

      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("offerPrice", Number(offerPrice));

      // Thêm trường inStock mặc định là true cho sản phẩm mới
      formData.append("inStock", true);

      // Thêm images vào FormData
      files.forEach((file) => {
        if (file) {
          formData.append("images", file);
        }
      });

      // Gọi API để thêm sản phẩm
      await addProduct(formData);

      // Reset form sau khi submit thành công
      setFiles([null, null, null, null]);
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setOfferPrice("");
      setErrors({});

      // Thông báo thành công
      toast.success("Thêm sản phẩm thành công!");
      // Chuyển hướng về trang danh sách sản phẩm
      navigate("/seller/products");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.";
      setErrors({
        submit: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-65px)] overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Thêm sản phẩm mới
          </h1>
          <p className="text-gray-500 mt-1">
            Điền thông tin sản phẩm để thêm vào cửa hàng
          </p>
        </div>

        {/* Form Card */}
        <form
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Tải lên hình ảnh sản phẩm */}
          <div className="space-y-3">
            <p className="text-base font-semibold text-gray-900">
              Hình ảnh sản phẩm <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <label
                    className="block cursor-pointer"
                    htmlFor={`image${index}`}
                  >
                    <input
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      hidden
                      id={`image${index}`}
                      onChange={(e) => handleImageChange(index, e)}
                      type="file"
                    />
                    <div
                      className={`w-24 h-24 rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                        files[index]
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                      }`}
                    >
                      <img
                        alt=""
                        className="w-full h-full object-cover"
                        src={
                          files[index]
                            ? URL.createObjectURL(files[index])
                            : assets.upload_area
                        }
                      />
                    </div>
                  </label>
                  {errors[`image${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`image${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
            <p className="text-xs text-gray-400">
              Tải lên tối đa 4 hình ảnh (JPG, PNG, WebP)
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Tên sản phẩm */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-gray-900"
              htmlFor="product-name"
            >
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200`}
              id="product-name"
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.name;
                    return newErrors;
                  });
                }
              }}
              placeholder="Nhập tên sản phẩm"
              required
              type="text"
              value={name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Mô tả sản phẩm */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-gray-900"
              htmlFor="product-description"
            >
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white resize-none ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200`}
              id="product-description"
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              placeholder="Nhập mô tả chi tiết về sản phẩm&#10;Mỗi dòng sẽ là một điểm riêng biệt"
              rows="4"
              value={description}
            />
            {description.trim() && (
              <div className="text-xs text-gray-500">
                Mô tả sẽ được tách thành:{" "}
                {
                  description
                    .trim()
                    .split("\n")
                    .filter((line) => line.trim()).length
                }{" "}
                điểm
              </div>
            )}
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Danh mục */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-gray-900"
              htmlFor="category"
            >
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white ${errors.category ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200 cursor-pointer`}
              id="category"
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.category;
                    return newErrors;
                  });
                }
              }}
              value={category}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.path} value={cat.path}>
                  {cat.text}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Giá gốc và giá khuyến mãi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-900"
                htmlFor="product-price"
              >
                Giá gốc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white pr-16 ${errors.price ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200`}
                  id="product-price"
                  min="1"
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.price;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="0"
                  required
                  type="number"
                  value={price}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  VND
                </span>
              </div>
              {price && !errors.price && (
                <p className="text-sm text-primary font-medium">
                  {formatPriceDisplay(price)}
                </p>
              )}
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-900"
                htmlFor="offer-price"
              >
                Giá khuyến mãi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white pr-16 ${errors.offerPrice ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200`}
                  id="offer-price"
                  min="1"
                  onChange={(e) => {
                    setOfferPrice(e.target.value);
                    if (errors.offerPrice) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.offerPrice;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="0"
                  required
                  type="number"
                  value={offerPrice}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  VND
                </span>
              </div>
              {offerPrice && !errors.offerPrice && (
                <p className="text-sm text-primary font-medium">
                  {formatPriceDisplay(offerPrice)}
                </p>
              )}
              {errors.offerPrice && (
                <p className="text-red-500 text-sm">{errors.offerPrice}</p>
              )}
            </div>
          </div>

          {/* Nút gửi */}
          <div className="pt-4">
            <button
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 text-white cursor-pointer"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      fill="none"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                  ĐANG THÊM SẢN PHẨM...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  THÊM SẢN PHẨM
                </span>
              )}
            </button>
            {errors.submit && (
              <p className="text-red-500 text-sm text-center mt-3">
                {errors.submit}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
