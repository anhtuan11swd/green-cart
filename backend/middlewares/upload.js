import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

// Lấy đường dẫn hiện tại trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Lọc file chỉ cho phép ảnh
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  storage,
});

export default upload;
