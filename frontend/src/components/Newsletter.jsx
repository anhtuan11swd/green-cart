import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Đừng bỏ lỡ ưu đãi nào!
      </h1>
      <p className="md:text-lg text-gray-500/80 pb-8">
        Đăng ký để nhận các ưu đãi mới nhất, sản phẩm mới và giảm giá độc quyền
      </p>
      <form
        className="flex items-center max-w-2xl w-full md:h-13 h-12"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-gray-500/30 rounded-l-md h-full outline-none flex-1 px-3 text-gray-500"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập địa chỉ email của bạn"
          required
          type="email"
          value={email}
        />
        <button
          className="md:px-12 px-8 h-full text-white bg-primary rounded-r-md hover:bg-primary-dull transition-colors whitespace-nowrap"
          type="submit"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
