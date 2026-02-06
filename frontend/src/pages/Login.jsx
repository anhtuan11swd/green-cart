import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        // Redirect to home page after successful login
        navigate("/");
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      name: "",
      password: "",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-start gap-4 bg-white shadow-xl m-auto mx-auto mt-20 mb-20 p-8 py-12 border border-gray-200 rounded-lg min-w-80 sm:min-w-88 max-w-md">
        <p className="m-auto font-medium text-2xl">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </p>

        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="w-full">
              <p>Tên</p>
              <input
                className="mt-1 p-2 border border-gray-200 rounded outline-primary w-full"
                name="name"
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                required
                type="text"
                value={formData.name}
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              className="mt-1 p-2 border border-gray-200 rounded outline-primary w-full"
              name="email"
              onChange={handleChange}
              placeholder="nguyenvana@gmail.com"
              required
              type="email"
              value={formData.email}
            />
          </div>

          <div className="w-full">
            <p>Mật khẩu</p>
            <input
              className="mt-1 p-2 border border-gray-200 rounded outline-primary w-full"
              name="password"
              onChange={handleChange}
              placeholder="Mật khẩu ít nhất 6 ký tự"
              required
              type="password"
              value={formData.password}
            />
          </div>

          <p className="text-sm">
            {isLogin ? "Tạo tài khoản?" : "Đã có tài khoản?"}{" "}
            <button
              className="bg-transparent p-0 border-none text-primary cursor-pointer"
              onClick={toggleMode}
              type="button"
            >
              nhấn vào đây
            </button>
          </p>

          <button
            className="bg-primary disabled:opacity-50 py-2 rounded-md w-full text-white cursor-pointer disabled:cursor-not-allowed"
            disabled={loading}
            type="submit"
          >
            {loading
              ? "Đang xử lý..."
              : isLogin
                ? "Đăng nhập"
                : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
