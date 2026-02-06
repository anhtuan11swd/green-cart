import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

// Trang thêm địa chỉ giao hàng với validation form
const AddAddress = () => {
  const { navigate } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    street: "",
    zipcode: "",
  });

  const handleInputChange = (e) => {
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
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "street",
        "city",
        "state",
        "zipcode",
        "country",
        "phone",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field].trim(),
      );
      if (missingFields.length > 0) {
        alert(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Email không hợp lệ");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-address`,
        {
          body: JSON.stringify(formData),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Địa chỉ đã được lưu thành công!");
        navigate("/cart");
      } else {
        alert(data.message || "Có lỗi xảy ra khi lưu địa chỉ");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Có lỗi xảy ra khi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pb-16">
      <p className="text-gray-500 text-2xl md:text-3xl">
        Thêm <span className="font-semibold text-primary">Địa chỉ</span> giao
        hàng
      </p>
      <div className="flex md:flex-row flex-col-reverse justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form className="space-y-3 mt-6 text-sm" onSubmit={handleSubmit}>
            <div className="gap-4 grid grid-cols-2">
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="firstName"
                onChange={handleInputChange}
                placeholder="Tên"
                required
                type="text"
                value={formData.firstName}
              />
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="lastName"
                onChange={handleInputChange}
                placeholder="Họ"
                required
                type="text"
                value={formData.lastName}
              />
            </div>
            <input
              className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
              name="email"
              onChange={handleInputChange}
              placeholder="Email"
              required
              type="email"
              value={formData.email}
            />
            <input
              className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
              name="street"
              onChange={handleInputChange}
              placeholder="Đường phố"
              required
              type="text"
              value={formData.street}
            />
            <div className="gap-4 grid grid-cols-2">
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="city"
                onChange={handleInputChange}
                placeholder="Thành phố"
                required
                type="text"
                value={formData.city}
              />
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="state"
                onChange={handleInputChange}
                placeholder="Tỉnh/Thành"
                required
                type="text"
                value={formData.state}
              />
            </div>
            <div className="gap-4 grid grid-cols-2">
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="zipcode"
                onChange={handleInputChange}
                placeholder="Mã bưu điện"
                required
                type="number"
                value={formData.zipcode}
              />
              <input
                className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
                name="country"
                onChange={handleInputChange}
                placeholder="Quốc gia"
                required
                type="text"
                value={formData.country}
              />
            </div>
            <input
              className="px-2 py-2.5 border border-gray-500/30 focus:border-primary rounded outline-none w-full text-gray-500 transition"
              name="phone"
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              required
              type="text"
              value={formData.phone}
            />
            <button
              className="bg-primary hover:bg-primary-dull disabled:opacity-50 mt-6 py-3 w-full text-white uppercase transition cursor-pointer disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </form>
        </div>
        <img
          alt="Thêm địa chỉ"
          className="md:mt-0 md:mr-16 mb-16"
          src={assets.add_address_iamge}
        />
      </div>
    </div>
  );
};

export default AddAddress;
