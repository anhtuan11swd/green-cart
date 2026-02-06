import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  try {
    cloudinary.config({
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
    console.log("Cloudinary được cấu hình thành công");
  } catch (error) {
    console.error(`Lỗi cấu hình Cloudinary: ${error.message}`);
  }
};

export default connectCloudinary;
