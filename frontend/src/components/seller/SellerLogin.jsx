import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { api, loginSeller, navigate } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div
        id="_rht_toaster"
        style={{
          inset: "16px",
          pointerEvents: "none",
          position: "fixed",
          zIndex: 9999,
        }}
      ></div>
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            alt="GreenCart Logo"
            className="h-16 mx-auto mb-4"
            src={assets.logo}
          />
          <h1 className="text-2xl font-bold text-gray-900">Seller Portal</h1>
          <p className="text-gray-500 mt-1">Quản lý cửa hàng của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Đăng nhập
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200`}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="nhập vào đây"
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"} outline-none transition-all duration-200 pr-12`}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="nhập vào đây"
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                  />
                  <button
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                        <path
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              <button
                className={`w-full py-3.5 rounded-lg font-medium transition-all duration-200 ${
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
                    ĐANG ĐĂNG NHẬP...
                  </span>
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 GreenCart. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;
