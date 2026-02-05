import { useNavigate } from "react-router-dom";
import { categories } from "../assets/assets";

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryPath) => {
    navigate(`/products/${categoryPath}`);
  };

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Danh mục</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category) => (
          <button
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center transition-all duration-300 hover:scale-105 border-none bg-transparent"
            key={category.path}
            onClick={() => handleCategoryClick(category.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCategoryClick(category.path);
              }
            }}
            // Xử lý điều hướng bằng phím Enter hoặc Space để hỗ trợ người dùng keyboard
            style={{ backgroundColor: category.bgColor }}
            type="button"
          >
            <img
              alt={category.text}
              className="group-hover:scale-110 transition-transform duration-300 max-w-28"
              src={category.image}
            />
            <p className="text-sm font-medium text-center">{category.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
