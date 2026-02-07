import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Mapping tên ảnh sang đường dẫn file
 */
const imageMapping = {
  // Sản phẩm sữa
  amul_milk_image: "amul_milk_image.png",

  // Trái cây
  apple_image: "apple_image.png",
  banana_image_1: "banana_image_1.png",
  barley_image: "barley_image.png",

  // Ngũ cốc
  basmati_rice_image: "basmati_rice_image.png",

  // Bánh mì
  brown_bread_image: "brown_bread_image.png",
  brown_rice_image: "brown_rice_image.png",
  butter_croissant_image: "butter_croissant_image.png",
  carrot_image: "carrot_image.png",
  cheese_image: "cheese_image.png",
  chocolate_cake_image: "chocolate_cake_image.png",

  // Đồ uống
  coca_cola_image: "coca_cola_image.png",
  eggs_image: "eggs_image.png",
  fanta_image_1: "fanta_image_1.png",
  grapes_image_1: "grapes_image_1.png",
  knorr_soup_image: "knorr_soup_image.png",

  // Đồ ăn nhanh
  maggi_image: "maggi_image.png",
  maggi_oats_image: "maggi_oats_image.png",
  mango_image_1: "mango_image_1.png",
  onion_image_1: "onion_image_1.png",
  orange_image: "orange_image.png",
  paneer_image: "paneer_image.png",
  paneer_image_2: "paneer_image_2.png",
  pepsi_image: "pepsi_image.png",
  // Rau củ
  potato_image_1: "potato_image_1.png",
  potato_image_2: "potato_image_2.png",
  potato_image_3: "potato_image_3.png",
  potato_image_4: "potato_image_4.png",
  quinoa_image: "quinoa_image.png",
  seven_up_image_1: "seven_up_image_1.png",
  spinach_image_1: "spinach_image_1.png",
  sprite_image_1: "sprite_image_1.png",
  tomato_image: "tomato_image.png",
  top_ramen_image: "top_ramen_image.png",
  vanilla_muffins_image: "vanilla_muffins_image.png",
  wheat_flour_image: "wheat_flour_image.png",
  whole_wheat_bread_image: "whole_wheat_bread_image.png",
  yippee_image: "yippee_image.png",
};

/**
 * Upload file ảnh lên Cloudinary
 */
const uploadImageToCloudinary = async (imageName) => {
  try {
    const imagePath = path.join(
      __dirname,
      "../../frontend/src/assets",
      imageMapping[imageName],
    );

    // Kiểm tra file tồn tại
    if (!fs.existsSync(imagePath)) {
      console.warn(`File không tồn tại: ${imagePath}`);
      return null;
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "green-cart/products",
      public_id: `${imageName}_${Date.now()}`, // Thêm timestamp để tránh trùng tên
      resource_type: "image",
    });

    return result.secure_url;
  } catch (error) {
    console.error(`Lỗi upload ảnh ${imageName}:`, error);
    return null;
  }
};

/**
 * Dữ liệu mẫu sản phẩm từ frontend assets
 */
const dummyProducts = [
  // Rau củ
  {
    category: "Rau củ",
    description: [
      "Tươi ngon và hữu cơ",
      "Giàu tinh bột",
      "Lý tưởng cho cà ri và khoai tây chiên",
    ],
    image: [
      "potato_image_1",
      "potato_image_2",
      "potato_image_3",
      "potato_image_4",
    ],
    inStock: true,
    name: "Khoai tây 500g",
    offerPrice: 6000,
    price: 7500,
  },
  {
    category: "Rau củ",
    description: [
      "Mọng nước và chín cây",
      "Giàu Vitamin C",
      "Hoàn hảo cho salad và sốt",
      "Chất lượng tươi từ nông trại",
    ],
    image: ["tomato_image"],
    inStock: true,
    name: "Cà chua 1 kg",
    offerPrice: 10500,
    price: 12000,
  },
  {
    category: "Rau củ",
    description: [
      "Ngọt và giòn",
      "Tốt cho thị lực",
      "Lý tưởng cho nước ép và salad",
    ],
    image: ["carrot_image"],
    inStock: true,
    name: "Cà rốt 500g",
    offerPrice: 8400,
    price: 9000,
  },
  {
    category: "Rau củ",
    description: ["Giàu sắt", "Cao vitamin", "Hoàn hảo cho súp và salad"],
    image: ["spinach_image_1"],
    inStock: true,
    name: "Rau bina 500g",
    offerPrice: 4500,
    price: 5400,
  },
  {
    category: "Rau củ",
    description: [
      "Tươi và cay nồng",
      "Hoàn hảo cho nấu ăn",
      "Nguyên liệu cơ bản trong bếp",
    ],
    image: ["onion_image_1"],
    inStock: true,
    name: "Hành tây 500g",
    offerPrice: 5700,
    price: 6600,
  },

  // Trái cây
  {
    category: "Trái cây",
    description: [
      "Giòn và mọng nước",
      "Giàu chất xơ",
      "Tăng cường miễn dịch",
      "Hoàn hảo cho ăn vặt và tráng miệng",
      "Hữu cơ và tươi từ nông trại",
    ],
    image: ["apple_image"],
    inStock: true,
    name: "Táo 1 kg",
    offerPrice: 33000,
    price: 36000,
  },
  {
    category: "Trái cây",
    description: [
      "Mọng nước và ngọt",
      "Giàu Vitamin C",
      "Hoàn hảo cho nước ép và salad",
    ],
    image: ["orange_image"],
    inStock: true,
    name: "Cam 1 kg",
    offerPrice: 22500,
    price: 24000,
  },
  {
    category: "Trái cây",
    description: [
      "Ngọt và chín cây",
      "Cao kali",
      "Tuyệt vời cho sinh tố và ăn vặt",
    ],
    image: ["banana_image_1"],
    inStock: true,
    name: "Chuối 1 kg",
    offerPrice: 13500,
    price: 15000,
  },
  {
    category: "Trái cây",
    description: [
      "Ngọt và đậm đà",
      "Hoàn hảo cho sinh tố và tráng miệng",
      "Giàu Vitamin A",
    ],
    image: ["mango_image_1"],
    inStock: true,
    name: "Xoài 1 kg",
    offerPrice: 42000,
    price: 45000,
  },
  {
    category: "Trái cây",
    description: [
      "Tươi và mọng nước",
      "Giàu chất chống oxy hóa",
      "Hoàn hảo cho ăn vặt và salad trái cây",
    ],
    image: ["grapes_image_1"],
    inStock: true,
    name: "Nho 500g",
    offerPrice: 19500,
    price: 21000,
  },

  // Sản phẩm sữa
  {
    category: "Sản phẩm sữa",
    description: [
      "Thuần khiết và tươi ngon",
      "Giàu canxi",
      "Lý tưởng cho trà, cà phê và tráng miệng",
      "Chất lượng thương hiệu đáng tin cậy",
    ],
    image: ["amul_milk_image"],
    inStock: true,
    name: "Sữa Amul 1L",
    offerPrice: 16500,
    price: 18000,
  },
  {
    category: "Sản phẩm sữa",
    description: [
      "Mềm và tươi",
      "Giàu protein",
      "Lý tưởng cho cà ri và đồ ăn nhẹ",
    ],
    image: ["paneer_image"],
    inStock: true,
    name: "Paneer 200g",
    offerPrice: 25500,
    price: 27000,
  },
  {
    category: "Sản phẩm sữa",
    description: [
      "Tươi từ nông trại",
      "Giàu protein",
      "Lý tưởng cho bữa sáng và làm bánh",
    ],
    image: ["eggs_image"],
    inStock: true,
    name: "Trứng gà 12 quả",
    offerPrice: 25500,
    price: 27000,
  },
  {
    category: "Sản phẩm sữa",
    description: [
      "Mềm và tươi",
      "Giàu protein",
      "Lý tưởng cho cà ri và đồ ăn nhẹ",
    ],
    image: ["paneer_image_2"],
    inStock: true,
    name: "Paneer 200g",
    offerPrice: 25500,
    price: 27000,
  },
  {
    category: "Sản phẩm sữa",
    description: [
      "Mịn và ngon miệng",
      "Hoàn hảo cho pizza và bánh mì kẹp",
      "Giàu canxi",
    ],
    image: ["cheese_image"],
    inStock: true,
    name: "Phô mai 200g",
    offerPrice: 39000,
    price: 42000,
  },

  // Đồ uống
  {
    category: "Đồ uống",
    description: [
      "Sảng khoái và có ga",
      "Hoàn hảo cho tiệc tùng và gặp gỡ",
      "Tốt nhất khi uống lạnh",
    ],
    image: ["coca_cola_image"],
    inStock: true,
    name: "Coca-Cola 1.5L",
    offerPrice: 22500,
    price: 24000,
  },
  {
    category: "Đồ uống",
    description: [
      "Lạnh và sảng khoái",
      "Hoàn hảo cho lễ kỷ niệm",
      "Tốt nhất khi uống lạnh",
    ],
    image: ["pepsi_image"],
    inStock: true,
    name: "Pepsi 1.5L",
    offerPrice: 21900,
    price: 23400,
  },
  {
    category: "Đồ uống",
    description: [
      "Hương vị chanh sảng khoái",
      "Hoàn hảo cho những ngày nóng",
      "Tốt nhất khi uống lạnh",
    ],
    image: ["sprite_image_1"],
    inStock: true,
    name: "Sprite 1.5L",
    offerPrice: 22200,
    price: 23700,
  },
  {
    category: "Đồ uống",
    description: [
      "Ngọt và có ga",
      "Tuyệt vời cho tiệc tùng và gặp gỡ",
      "Tốt nhất khi uống lạnh",
    ],
    image: ["fanta_image_1"],
    inStock: true,
    name: "Fanta 1.5L",
    offerPrice: 21600,
    price: 23100,
  },
  {
    category: "Đồ uống",
    description: [
      "Hương vị chanh chanh sảng khoái",
      "Hoàn hảo để làm mới",
      "Tốt nhất khi uống lạnh",
    ],
    image: ["seven_up_image_1"],
    inStock: true,
    name: "7 Up 1.5L",
    offerPrice: 21300,
    price: 22800,
  },

  // Ngũ cốc
  {
    category: "Ngũ cốc",
    description: [
      "Hạt dài và thơm",
      "Hoàn hảo cho biryani và pulao",
      "Chất lượng cao cấp",
    ],
    image: ["basmati_rice_image"],
    inStock: true,
    name: "Gạo Basmati 5kg",
    offerPrice: 156000,
    price: 165000,
  },
  {
    category: "Ngũ cốc",
    description: [
      "Bột mì nguyên hạt chất lượng cao",
      "Bánh mì mềm và xốp",
      "Giàu dinh dưỡng",
    ],
    image: ["wheat_flour_image"],
    inStock: true,
    name: "Bột mì 5kg",
    offerPrice: 69000,
    price: 75000,
  },
  {
    category: "Ngũ cốc",
    description: [
      "Cao protein và chất xơ",
      "Không chứa gluten",
      "Giàu vitamin và khoáng chất",
    ],
    image: ["quinoa_image"],
    inStock: true,
    name: "Diêm mạch hữu cơ 500g",
    offerPrice: 126000,
    price: 135000,
  },
  {
    category: "Ngũ cốc",
    description: [
      "Ngũ cốc nguyên hạt và bổ dưỡng",
      "Giúp kiểm soát cân nặng",
      "Nguồn magie tốt",
    ],
    image: ["brown_rice_image"],
    inStock: true,
    name: "Gạo lứt 1kg",
    offerPrice: 33000,
    price: 36000,
  },
  {
    category: "Ngũ cốc",
    description: [
      "Giàu chất xơ",
      "Giúp cải thiện tiêu hóa",
      "Ít chất béo và cholesterol",
    ],
    image: ["barley_image"],
    inStock: true,
    name: "Lúa mạch 1kg",
    offerPrice: 42000,
    price: 45000,
  },

  // Bánh mì
  {
    category: "Bánh mì",
    description: [
      "Mềm và lành mạnh",
      "Làm từ lúa mì nguyên hạt",
      "Lý tưởng cho bữa sáng và bánh mì kẹp",
    ],
    image: ["brown_bread_image"],
    inStock: true,
    name: "Bánh mì nâu 400g",
    offerPrice: 10500,
    price: 12000,
  },
  {
    category: "Bánh mì",
    description: [
      "Bơ và giòn",
      "Mới nướng",
      "Hoàn hảo cho bữa sáng hoặc đồ ăn nhẹ",
    ],
    image: ["butter_croissant_image"],
    inStock: true,
    name: "Bánh sừng bơ 100g",
    offerPrice: 13500,
    price: 15000,
  },
  {
    category: "Bánh mì",
    description: [
      "Giàu và ẩm",
      "Làm từ ca cao cao cấp",
      "Lý tưởng cho lễ kỷ niệm và tiệc tùng",
    ],
    image: ["chocolate_cake_image"],
    inStock: true,
    name: "Bánh ga tô sô cô la 500g",
    offerPrice: 97500,
    price: 105000,
  },
  {
    category: "Bánh mì",
    description: [
      "Lành mạnh và bổ dưỡng",
      "Làm từ bột mì nguyên hạt",
      "Lý tưởng cho bánh mì kẹp và bánh mì nướng",
    ],
    image: ["whole_wheat_bread_image"],
    inStock: true,
    name: "Bánh mì nguyên hạt 400g",
    offerPrice: 12000,
    price: 13500,
  },
  {
    category: "Bánh mì",
    description: [
      "Mềm và xốp",
      "Hoàn hảo cho đồ ăn nhẹ nhanh",
      "Làm từ vani thật",
    ],
    image: ["vanilla_muffins_image"],
    inStock: true,
    name: "Bánh muffin vani 6 cái",
    offerPrice: 27000,
    price: 30000,
  },

  // Đồ ăn nhanh
  {
    category: "Đồ ăn nhanh",
    description: [
      "Tức thì và dễ nấu",
      "Hương vị ngon miệng",
      "Phổ biến với trẻ em và người lớn",
    ],
    image: [],
    inStock: true,
    name: "Mì Maggi 280g",
    offerPrice: 15000,
    price: 16500,
  },
  {
    category: "Đồ ăn nhanh",
    description: [
      "Nhanh và dễ chuẩn bị",
      "Cay và đậm đà",
      "Được yêu thích bởi sinh viên và gia đình",
    ],
    image: ["top_ramen_image"],
    inStock: true,
    name: "Top Ramen 270g",
    offerPrice: 12000,
    price: 13500,
  },
  {
    category: "Đồ ăn nhanh",
    description: [
      "Tiện lợi khi đi đường",
      "Lành mạnh và bổ dưỡng",
      "Đa dạng hương vị",
    ],
    image: ["knorr_soup_image"],
    inStock: true,
    name: "Súp Knorr 70g",
    offerPrice: 9000,
    price: 10500,
  },
  {
    category: "Đồ ăn nhanh",
    description: [
      "Mì không chiên cho lựa chọn lành mạnh hơn",
      "Ngon và no bụng",
      "Tiện lợi cho lịch trình bận rộn",
    ],
    image: ["yippee_image"],
    inStock: true,
    name: "Mì Yippee 260g",
    offerPrice: 13500,
    price: 15000,
  },
  {
    category: "Đồ ăn nhanh",
    description: [
      "Thay thế lành mạnh với yến mạch",
      "Tốt cho tiêu hóa",
      "Hoàn hảo cho bữa sáng hoặc đồ ăn nhẹ",
    ],
    image: ["maggi_oats_image"],
    inStock: true,
    name: "Mì yến mạch 72g",
    offerPrice: 10500,
    price: 12000,
  },
];

/**
 * Khởi tạo dữ liệu mẫu cho sản phẩm nếu database rỗng
 * POST /api/seed/products
 */
export const seedProducts = async (_req, res) => {
  try {
    // Kiểm tra xem đã có sản phẩm nào trong database chưa
    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      return res.status(400).json({
        message: `Database đã có ${existingProducts} sản phẩm. Không thể khởi tạo dữ liệu mẫu.`,
      });
    }

    console.log("Bắt đầu upload ảnh và tạo sản phẩm mẫu...");

    // Upload ảnh và tạo sản phẩm với URL thực từ Cloudinary
    const productsWithImages = [];

    for (const product of dummyProducts) {
      const imageUrls = [];

      // Upload từng ảnh của sản phẩm
      for (const imageName of product.image) {
        const imageUrl = await uploadImageToCloudinary(imageName);
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      // Nếu không upload được ảnh, dùng placeholder
      if (imageUrls.length === 0) {
        imageUrls.push(
          `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`,
        );
      }

      productsWithImages.push({
        ...product,
        image: imageUrls,
      });
    }

    // Chèn tất cả sản phẩm mẫu vào database
    const insertedProducts = await Product.insertMany(productsWithImages);

    console.log(
      `Khoi tao thanh cong ${insertedProducts.length} san pham mau qua API`,
    );

    res.status(201).json({
      message: `Khởi tạo thành công ${insertedProducts.length} sản phẩm mẫu với ảnh thực`,
      products: insertedProducts,
    });
  } catch (error) {
    console.error("Lỗi khởi tạo dữ liệu mẫu:", error);
    res.status(500).json({
      error: error.message,
      message: "Lỗi khởi tạo dữ liệu mẫu",
    });
  }
};

/**
 * Khởi tạo dữ liệu mẫu tự động khi server khởi động (nếu database rỗng)
 */
export const autoSeedProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      console.log(
        `Database đã có ${existingProducts} sản phẩm. Bỏ qua việc seeding.`,
      );
      return;
    }

    console.log("Bắt đầu upload ảnh và tạo sản phẩm mẫu tự động...");

    // Upload ảnh và tạo sản phẩm với URL thực từ Cloudinary
    const productsWithImages = [];

    for (const product of dummyProducts) {
      const imageUrls = [];

      // Upload từng ảnh của sản phẩm
      for (const imageName of product.image) {
        const imageUrl = await uploadImageToCloudinary(imageName);
        if (imageUrl) {
          imageUrls.push(imageUrl);
        }
      }

      // Nếu không upload được ảnh, dùng placeholder
      if (imageUrls.length === 0) {
        imageUrls.push(
          `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`,
        );
      }

      productsWithImages.push({
        ...product,
        image: imageUrls,
      });
    }

    const insertedProducts = await Product.insertMany(productsWithImages);
    console.log(
      `Khoi tao thanh cong ${insertedProducts.length} san pham mau voi anh thuc`,
    );
  } catch (error) {
    console.error("Loi khoi tao du lieu mau tu dong:", error);
  }
};

/**
 * Xóa toàn bộ dữ liệu sản phẩm (chỉ dùng cho development)
 * DELETE /api/seed/products
 */
export const clearProducts = async (_req, res) => {
  try {
    // Chỉ cho phép trong môi trường development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        message: "Không thể xóa dữ liệu trong môi trường production",
      });
    }

    const result = await Product.deleteMany({});
    res.json({
      message: `Đã xóa ${result.deletedCount} sản phẩm`,
    });
  } catch (error) {
    console.error("Lỗi xóa dữ liệu:", error);
    res.status(500).json({
      error: error.message,
      message: "Lỗi xóa dữ liệu",
    });
  }
};
