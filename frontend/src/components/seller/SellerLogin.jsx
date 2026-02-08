import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { api, loginSeller, navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "greatstack123",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm validate dữ liệu form đăng nhập
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/seller/login", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        loginSeller(response.data.token);
        navigate("/seller");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      <div
        id="_rht_toaster"
        style={{
          inset: "16px",
          pointerEvents: "none",
          position: "fixed",
          zIndex: 9999,
        }}
      ></div>
      <div className="">
        <form
          className="min-h-screen flex items-center text-sm text-gray-600"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
            <p className="text-2xl font-medium m-auto">
              <span className="text-primary">Đăng nhập</span> Người bán
            </p>

            <div className="w-full">
              <p>Email</p>
              <input
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                name="email"
                onChange={handleChange}
                placeholder="nhập vào đây"
                required
                type="email"
                value={formData.email}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="w-full">
              <p>Mật khẩu</p>
              <input
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                name="password"
                onChange={handleChange}
                placeholder="nhập vào đây"
                required
                type="password"
                value={formData.password}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-500 text-xs text-center">
                {errors.general}
              </p>
            )}

            <button
              className={`bg-primary text-white w-full py-2 rounded-md transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-primary/90"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;
