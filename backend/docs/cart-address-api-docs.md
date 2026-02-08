# Green Cart - Cart & Address APIs

**Base URL:** `http://localhost:5000/api/user`

## Authentication

Tất cả API yêu cầu xác thực user với JWT token trong cookie:

- Cookie: `token=jwt_token_here` (tự động được gửi sau khi login)

---

## Cart APIs

### Cart Schema

```json
{
  "_id": "ObjectId",
  "cartItems": [
    {
      "product": "ObjectId",
      "quantity": 1
    }
  ]
}
```

---

### 1. Cập nhật giỏ hàng

- **URL:** `/cart/update`
- **Method:** `POST`
- **Authentication:** Required (User cookie JWT token)
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "cartItems": [
    {
      "product": "69871113beab70df2d654457",
      "quantity": 2
    },
    {
      "product": "69871113beab70df2d65444f",
      "quantity": 1
    }
  ]
}
```

**Trường hợp xóa sản phẩm khỏi giỏ hàng:**

```json
{
  "cartItems": [
    {
      "product": "60d5ecb54bbb4c001f8b4567",
      "quantity": 2
    }
  ]
}
```

**Response Success (200):**

```json
{
  "success": true,
  "cartItems": [
    {
      "product": "60d5ecb54bbb4c001f8b4567",
      "quantity": 2
    }
  ]
}
```

**Response Error (400):**

```json
{
  "message": "Dữ liệu giỏ hàng không hợp lệ"
}
```

**Response Error (404):**

```json
{
  "message": "Người dùng không tồn tại"
}
```

**Response Error (401):**

```json
{
  "message": "Vui lòng đăng nhập để tiếp tục"
}
```

---

## Address APIs

### Address Schema

```json
{
  "_id": "ObjectId",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "street": "123 Đường ABC",
  "city": "Hà Nội",
  "state": "Quận Ba Đình",
  "zipCode": "10000",
  "country": "Việt Nam",
  "userId": "ObjectId",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 1. Thêm địa chỉ mới

- **URL:** `/address/add`
- **Method:** `POST`
- **Authentication:** Required (User cookie JWT token)
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "street": "123 Đường ABC",
  "city": "Hà Nội",
  "state": "Quận Ba Đình",
  "zipCode": "10000",
  "country": "Việt Nam"
}
```

**Validation:**

- `firstName`: Bắt buộc, string
- `lastName`: Bắt buộc, string
- `email`: Bắt buộc, định dạng email hợp lệ
- `phone`: Bắt buộc, string
- `street`: Bắt buộc, string
- `city`: Bắt buộc, string
- `state`: Bắt buộc, string
- `zipCode`: Bắt buộc, string
- `country`: Tùy chọn, mặc định là "Việt Nam"

**Response Success (201):**

```json
{
  "success": true,
  "message": "Thêm địa chỉ thành công",
  "address": {
    "_id": "65abc123456789",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "street": "123 Đường ABC",
    "city": "Hà Nội",
    "state": "Quận Ba Đình",
    "zipCode": "10000",
    "country": "Việt Nam",
    "userId": "65abc123456780",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (400):**

```json
{
  "message": "Email không hợp lệ"
}
```

**Response Error (401):**

```json
{
  "message": "Vui lòng đăng nhập để tiếp tục"
}
```

---

### 2. Lấy danh sách địa chỉ

- **URL:** `/address/get`
- **Method:** `GET`
- **Authentication:** Required (User cookie JWT token)

**Response Success (200):**

```json
{
  "success": true,
  "addresses": [
    {
      "_id": "65abc123456789",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "email": "user@example.com",
      "phone": "0123456789",
      "street": "123 Đường ABC",
      "city": "Hà Nội",
      "state": "Quận Ba Đình",
      "zipCode": "10000",
      "country": "Việt Nam",
      "userId": "65abc123456780",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "65abc123456790",
      "firstName": "Nguyễn",
      "lastName": "Văn B",
      "email": "user@example.com",
      "phone": "0987654321",
      "street": "456 Đường XYZ",
      "city": "TP. Hồ Chí Minh",
      "state": "Quận 1",
      "zipCode": "70000",
      "country": "Việt Nam",
      "userId": "65abc123456780",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

**Response Error (401):**

```json
{
  "message": "Vui lòng đăng nhập để tiếp tục"
}
```

**Response Error (500):**

```json
{
  "message": "Lỗi server"
}
```

---

## Test Scenarios

### 1. Test Cập nhật Giỏ hàng

1. Login user để lấy token (cookie sẽ được set tự động)
2. Gọi API `/cart/update` với danh sách sản phẩm
3. Kiểm tra response 200 và cartItems được cập nhật
4. **Test error case:** Gửi cartItems không phải array → response 400
5. Test xóa sản phẩm bằng cách gửi lại danh sách không có sản phẩm đó

### 2. Test Thêm Địa chỉ

1. Login user để lấy token
2. Gọi API `/address/add` với thông tin địa chỉ hợp lệ
3. Kiểm tra response 201 và địa chỉ được tạo
4. **Test error case:** Gửi email không hợp lệ → response 400
5. Test không gửi country → mặc định là "Việt Nam"

### 3. Test Lấy Danh sách Địa chỉ

1. Login user để lấy token
2. Gọi API `/address/get`
3. Kiểm tra response 200 và danh sách địa chỉ
4. Test với user chưa có địa chỉ nào → trả về mảng rỗng `[]`

### 4. Test Workflow Hoàn chỉnh

1. Login user
2. Thêm nhiều sản phẩm vào giỏ hàng bằng `/cart/update`
3. Thêm địa chỉ giao hàng bằng `/address/add`
4. Lấy danh sách địa chỉ bằng `/address/get`
5. Sử dụng địa chỉ ID để tạo đơn hàng COD

---

## Error Codes

- **400 Bad Request:** Dữ liệu đầu vào không hợp lệ, email không đúng định dạng
- **401 Unauthorized:** Chưa đăng nhập hoặc token không hợp lệ
- **404 Not Found:** Người dùng không tồn tại
- **500 Internal Server Error:** Lỗi server (xem console log để debug)

---

## Notes

- Tất cả API trong phần này yêu cầu xác thực user qua cookie JWT
- Cookie `token` được tự động set sau khi login và tự động gửi trong các request tiếp theo
- User có thể thêm nhiều địa chỉ giao hàng
- Cart items lưu theo format `{ product: ObjectId, quantity: Number }`
- Khi cập nhật giỏ hàng, toàn bộ cartItems sẽ được thay thế (không phải merge)
