import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const AddProduct = () => {
  const { formatVND } = useContext(AppContext);

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
      files.forEach((file, index) => {
        if (file) {
          formData.append(`image${index}`, file);
        }
      });

      // TODO: Gọi API để thêm sản phẩm
      console.log("Product data:", Object.fromEntries(formData));

      // Reset form sau khi submit thành công
      setFiles([null, null, null, null]);
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setOfferPrice("");
      setErrors({});

      // Thông báo thành công
      alert("Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      setErrors({
        submit: "Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form className="md:p-10 p-4 space-y-5 max-w-lg" onSubmit={handleSubmit}>
        {/* Tải lên hình ảnh sản phẩm */}
        <div>
          <p className="text-base font-medium">
            Hình ảnh sản phẩm <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <label htmlFor={`image${index}`}>
                  <input
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    hidden
                    id={`image${index}`}
                    onChange={(e) => handleImageChange(index, e)}
                    type="file"
                  />
                  <img
                    alt=""
                    className="max-w-24 cursor-pointer"
                    height="100"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    width="100"
                  />
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
            <p className="text-red-500 text-sm mt-2">{errors.images}</p>
          )}
        </div>

        {/* Tên sản phẩm */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.name ? "border-red-500" : "border-gray-500/40"}`}
            id="product-name"
            onChange={(e) => {
              setName(e.target.value);
              // Xóa lỗi khi user bắt đầu nhập
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
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Mô tả sản phẩm */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Mô tả sản phẩm <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`outline-none md:py-2.5 py-2 px-3 rounded border resize-none ${errors.description ? "border-red-500" : "border-gray-500/40"}`}
            id="product-description"
            onChange={(e) => {
              setDescription(e.target.value);
              // Xóa lỗi khi user bắt đầu nhập
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
            <div className="text-xs text-gray-500 mt-1">
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
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.category ? "border-red-500" : "border-gray-500/40"}`}
            id="category"
            onChange={(e) => {
              setCategory(e.target.value);
              // Xóa lỗi khi user chọn
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
        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 min-w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Giá gốc <span className="text-red-500">*</span>
            </label>
            <input
              className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.price ? "border-red-500" : "border-gray-500/40"}`}
              id="product-price"
              min="1"
              onChange={(e) => {
                setPrice(e.target.value);
                // Xóa lỗi khi user bắt đầu nhập
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
            {price && !errors.price && (
              <p className="text-sm text-gray-600">
                {formatPriceDisplay(price)}
              </p>
            )}
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Giá khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.offerPrice ? "border-red-500" : "border-gray-500/40"}`}
              id="offer-price"
              min="1"
              onChange={(e) => {
                setOfferPrice(e.target.value);
                // Xóa lỗi khi user bắt đầu nhập
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
            {offerPrice && !errors.offerPrice && (
              <p className="text-sm text-gray-600">
                {formatPriceDisplay(offerPrice)}
              </p>
            )}
            {errors.offerPrice && (
              <p className="text-red-500 text-sm">{errors.offerPrice}</p>
            )}
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex flex-col gap-2">
          <button
            className={`px-8 py-2.5 font-medium rounded transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            } text-white`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "ĐANG THÊM..." : "THÊM SẢN PHẨM"}
          </button>
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
