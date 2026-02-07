# Green Cart - Product APIs

**Base URL:** `http://localhost:5000/api/product`

## Tổng quan

API quản lý sản phẩm cho ứng dụng Green Cart. Bao gồm các chức năng thêm, lấy danh sách, xem chi tiết, cập nhật trạng thái tồn kho và xóa sản phẩm.

## Authentication

Một số API yêu cầu xác thực seller với Bearer token trong header:
```
Authorization: Bearer jwt_token_here
```

## Product Schema

```json
{
  "_id": "ObjectId",
  "name": "Tên sản phẩm",
  "category": "Rau củ | Trái cây | Đồ uống | Đồ ăn nhanh | Sản phẩm sữa | Bánh mì | Ngũ cốc",
  "price": 50000,
  "offerPrice": 45000,
  "description": ["Mô tả 1", "Mô tả 2"],
  "image": ["url_anh_1.jpg", "url_anh_2.jpg"],
  "inStock": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 1. Thêm sản phẩm mới

- **URL:** `/add`
- **Method:** `POST`
- **Authentication:** Required (Seller Bearer token)
- **Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Form Data:**
- `name`: Tên sản phẩm (string, required)
- `category`: Danh mục sản phẩm (string, required) - Chọn từ: "Rau củ", "Trái cây", "Đồ uống", "Đồ ăn nhanh", "Sản phẩm sữa", "Bánh mì", "Ngũ cốc"
- `price`: Giá gốc (number, required, min: 0)
- `offerPrice`: Giá khuyến mãi (number, required, min: 0)
- `description`: Mô tả sản phẩm (string, required) - JSON array string, ví dụ: `["Mô tả 1", "Mô tả 2", "Mô tả 3"]`
- `inStock`: Trạng thái tồn kho (boolean, optional, default: true)
- `images`: File ảnh (multiple files, required, max 5 files, max size: 5MB each, formats: jpeg/jpg/png/gif/webp)

**Request Example (Postman):**
- Chọn Body → form-data
- Thêm các field text như trên
- Thêm field `images` với type File, chọn multiple files

**Response Success (201):**

```json
{
  "message": "Tạo sản phẩm thành công",
  "product": {
    "_id": "...",
    "name": "Táo Granny Smith",
    "category": "Trái cây",
    "price": 50000,
    "offerPrice": 45000,
    "description": ["Táo nhập khẩu", "Giàu vitamin C"],
    "image": [
      "https://res.cloudinary.com/.../green-cart/products/abc123.jpg",
      "https://res.cloudinary.com/.../green-cart/products/def456.jpg"
    ],
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (400):**

```json
{
  "message": "Vui lòng tải lên ít nhất 1 ảnh"
}
```

**Response Error (400) - Dữ liệu mô tả không hợp lệ:**

```json
{
  "message": "Dữ liệu mô tả sản phẩm không hợp lệ",
  "error": "Unexpected token ']', ... is not valid JSON"
}
```

**Response Error (401):**

```json
{
  "message": "Token không hợp lệ"
}
```

---

## 2. Lấy danh sách tất cả sản phẩm

- **URL:** `/list`
- **Method:** `GET`
- **Authentication:** Không yêu cầu
- **Content-Type:** Không cần

**Response Success (200):**

```json
{
  "products": [
    {
      "_id": "...",
      "name": "Táo Granny Smith",
      "category": "Trái cây",
      "price": 50000,
      "offerPrice": 45000,
      "description": ["Táo nhập khẩu", "Giàu vitamin C"],
      "image": ["https://res.cloudinary.com/.../image1.jpg"],
      "inStock": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 3. Lấy chi tiết sản phẩm

- **URL:** `/:id`
- **Method:** `GET`
- **Authentication:** Không yêu cầu
- **Content-Type:** Không cần

**URL Parameters:**
- `id`: ID của sản phẩm (string, required)

**Example:** `GET /api/product/60d5ecb54bbb4c001f8b4567`

**Response Success (200):**

```json
{
  "product": {
    "_id": "60d5ecb54bbb4c001f8b4567",
    "name": "Táo Granny Smith",
    "category": "Trái cây",
    "price": 50000,
    "offerPrice": 45000,
    "description": ["Táo nhập khẩu", "Giàu vitamin C"],
    "image": ["https://res.cloudinary.com/.../image1.jpg"],
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## 4. Cập nhật trạng thái tồn kho

- **URL:** `/stock/:id`
- **Method:** `POST`
- **Authentication:** Required (Seller Bearer token)
- **Content-Type:** `application/json`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**URL Parameters:**
- `id`: ID của sản phẩm (string, required)

**Request Body:** Empty (không cần body)

**Example:** `POST /api/product/stock/60d5ecb54bbb4c001f8b4567`

**Response Success (200):**

```json
{
  "message": "Cập nhật trạng thái tồn kho thành công (Hết hàng)",
  "product": {
    "_id": "60d5ecb54bbb4c001f8b4567",
    "name": "Táo Granny Smith",
    "category": "Trái cây",
    "price": 50000,
    "offerPrice": 45000,
    "description": ["Táo nhập khẩu", "Giàu vitamin C"],
    "image": ["https://res.cloudinary.com/.../image1.jpg"],
    "inStock": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## 5. Xóa sản phẩm

- **URL:** `/:id`
- **Method:** `DELETE`
- **Authentication:** Required (Seller Bearer token)
- **Content-Type:** `application/json`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**URL Parameters:**
- `id`: ID của sản phẩm (string, required)

**Example:** `DELETE /api/product/60d5ecb54bbb4c001f8b4567`

**Response Success (200):**

```json
{
  "message": "Xóa sản phẩm thành công",
  "product": {
    "_id": "60d5ecb54bbb4c001f8b4567",
    "name": "Táo Granny Smith",
    "category": "Trái cây",
    "price": 50000,
    "offerPrice": 45000,
    "description": ["Táo nhập khẩu", "Giàu vitamin C"],
    "image": ["https://res.cloudinary.com/.../image1.jpg"],
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## Test Scenarios

### 1. Test Thêm Sản Phẩm
1. Login seller để lấy token
2. Gọi API `/add` với form-data chứa thông tin sản phẩm và files ảnh
3. Kiểm tra response 201 và dữ liệu sản phẩm được tạo
4. **Test error case:** Gửi description không phải JSON hợp lệ → kiểm tra response 400 với message "Dữ liệu mô tả sản phẩm không hợp lệ"

### 2. Test Lấy Danh Sách Sản Phẩm
1. Gọi API `/list` không cần authentication
2. Kiểm tra response chứa mảng products

### 3. Test Lấy Chi Tiết Sản Phẩm
1. Gọi API `/:id` với ID sản phẩm hợp lệ
2. Kiểm tra response 200 và dữ liệu sản phẩm chi tiết
3. Test với ID không tồn tại → response 404

### 4. Test Toggle Stock
1. Login seller để lấy token
2. Gọi API `/stock/:id` với ID sản phẩm
3. Kiểm tra trạng thái `inStock` thay đổi

### 5. Test Xóa Sản Phẩm
1. Login seller để lấy token
2. Gọi API DELETE `/:id` với ID sản phẩm
3. Kiểm tra response 200 và sản phẩm bị xóa khỏi database

---

## Error Codes

- **400 Bad Request:** Dữ liệu đầu vào không hợp lệ, thiếu ảnh, hoặc dữ liệu mô tả sản phẩm không phải JSON hợp lệ
- **401 Unauthorized:** Token không hợp lệ hoặc hết hạn
- **404 Not Found:** Không tìm thấy sản phẩm với ID cung cấp
- **500 Internal Server Error:** Lỗi server (xem console log để debug)

---

## Notes

- Tất cả ảnh được upload tự động lên Cloudinary trong folder `green-cart/products`
- Khi xóa sản phẩm, các ảnh trên Cloudinary cũng sẽ được xóa tự động
- API sử dụng MongoDB ObjectId cho ID sản phẩm
- Các trường `price` và `offerPrice` phải là số dương
- `description` phải là JSON string array hợp lệ, ví dụ: `["Mô tả 1", "Mô tả 2"]`
- Nếu `description` không phải JSON hợp lệ, server sẽ trả về lỗi 400 với thông tin chi tiết