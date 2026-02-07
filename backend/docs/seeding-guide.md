# Hướng dẫn Khởi tạo Dữ liệu Mẫu

## Tổng quan

Chức năng seeding cho phép tự động khởi tạo dữ liệu mẫu sản phẩm từ file `frontend/src/assets/assets.js` khi database rỗng. Điều này hữu ích cho việc phát triển và testing.

## Tính năng

### 1. Auto Seeding (Tự động)
- Tự động chạy khi server khởi động
- Chỉ seeding nếu database chưa có sản phẩm nào
- Thêm 30 sản phẩm mẫu với đầy đủ thông tin

### 2. Manual Seeding (Thủ công)
- API endpoint để seeding thủ công
- Có thể gọi bất cứ lúc nào
- Kiểm tra database trước khi seeding

### 3. Clear Data (Xóa dữ liệu - Development only)
- Xóa toàn bộ sản phẩm
- Chỉ hoạt động trong môi trường development
- Bảo vệ dữ liệu production

## Dữ liệu Mẫu

### Danh mục sản phẩm:
- **Rau củ**: Khoai tây, Cà chua, Cà rốt, Rau bina, Hành tây
- **Trái cây**: Táo, Cam, Chuối, Xoài, Nho
- **Sản phẩm sữa**: Sữa, Paneer, Trứng, Phô mai
- **Đồ uống**: Coca-Cola, Pepsi, Sprite, Fanta, 7 Up
- **Ngũ cốc**: Gạo Basmati, Bột mì, Diêm mạch, Gạo lứt, Lúa mạch
- **Bánh mì**: Bánh mì nâu, Bánh sừng bơ, Bánh ga tô, Bánh mì nguyên hạt, Bánh muffin
- **Đồ ăn nhanh**: Maggi, Top Ramen, Súp Knorr, Yippee, Mì yến mạch

### Thông tin mỗi sản phẩm:
- Tên sản phẩm
- Danh mục
- Mô tả (mảng các điểm nổi bật)
- Giá gốc và giá ưu đãi
- Trạng thái tồn kho
- Hình ảnh thực từ `frontend/src/assets/` được upload lên Cloudinary

## Cách thức hoạt động

### Upload Ảnh lên Cloudinary
1. Đọc file ảnh từ `frontend/src/assets/`
2. Upload lên Cloudinary với cấu hình:
   - Folder: `green-cart/products`
   - Public ID: `{tên_ảnh}_{timestamp}`
   - Resource type: `image`
3. Lưu URL Cloudinary vào database
4. Fallback sang placeholder nếu upload thất bại

### Mapping Ảnh
Mỗi sản phẩm có mảng tên file ảnh tương ứng với file thực trong assets:
- `potato_image_1` → `potato_image_1.png`
- `apple_image` → `apple_image.png`
- etc.

## Cách sử dụng

### Auto Seeding (Khuyến nghị)
Server sẽ tự động seeding khi khởi động nếu database rỗng:

```bash
npm run dev
```

Quá trình sẽ:
1. Kiểm tra database rỗng
2. Upload từng ảnh từ `frontend/src/assets/` lên Cloudinary
3. Tạo sản phẩm với URL ảnh thực
4. Chèn vào database

Console sẽ hiển thị:
```
Bắt đầu upload ảnh và tạo sản phẩm mẫu tự động...
Khoi tao thanh cong 30 san pham mau voi anh thuc
```

### Manual Seeding qua API

#### Khởi tạo dữ liệu mẫu:
```bash
POST /api/seed/products
```

**Response thành công:**
```json
{
  "message": "Khởi tạo thành công 30 sản phẩm mẫu với ảnh thực",
  "products": [...]
}
```

**Response nếu đã có dữ liệu:**
```json
{
  "message": "Database đã có 15 sản phẩm. Không thể khởi tạo dữ liệu mẫu."
}
```

#### Xóa toàn bộ dữ liệu (Development only):
```bash
DELETE /api/seed/products
```

**Response:**
```json
{
  "message": "Đã xóa 30 sản phẩm"
}
```

## Cấu trúc File

```
backend/
├── controllers/
│   └── seed.js          # Logic seeding
├── routes/
│   └── seed.js          # API routes
├── docs/
│   └── seeding-guide.md # Tài liệu này
└── server.js            # Tích hợp auto seeding
```

## Lưu ý Bảo mật

- Chức năng xóa dữ liệu chỉ hoạt động trong môi trường development
- Production environment sẽ từ chối các request xóa dữ liệu
- Auto seeding chỉ chạy khi database hoàn toàn rỗng

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra file `.env` có đúng thông tin database không
- Đảm bảo MongoDB đang chạy

### Lỗi seeding
- Kiểm tra console logs để xem chi tiết lỗi
- Đảm bảo schema Product chưa bị thay đổi

### Không tự động seeding
- Kiểm tra database đã có dữ liệu chưa
- Restart server để trigger auto seeding