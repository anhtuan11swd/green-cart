# Green Cart - Order APIs

**Base URL:** `http://localhost:5000/api/order`

## Tổng quan

API quản lý đơn hàng cho ứng dụng Green Cart. Bao gồm các chức năng tạo đơn hàng COD, xem đơn hàng (user/seller), và cập nhật trạng thái đơn hàng.

## Authentication

- **User APIs:** Yêu cầu xác thực user với JWT token trong cookie
- **Seller APIs:** Yêu cầu xác thực seller với Bearer token trong header

---

## Order Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "address": {
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "street": "123 Đường ABC",
    "city": "Hà Nội",
    "state": "Quận Ba Đình",
    "zipCode": "10000",
    "country": "Việt Nam"
  },
  "items": [
    {
      "product": "ObjectId",
      "name": "Táo Granny Smith",
      "image": "https://res.cloudinary.com/.../image.jpg",
      "price": 50000,
      "offerPrice": 45000,
      "quantity": 2
    }
  ],
  "amount": 91800,
  "paymentType": "Tiền mặt",
  "status": "Đang xử lý",
  "isPaid": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Trường `status` (Order Status)

| Status           | Mô tả                               |
| ---------------- | ----------------------------------- |
| `Đang xử lý`     | Đơn hàng mới được tạo, chờ xác nhận |
| `Đã xác nhận`    | Seller đã xác nhận đơn hàng         |
| `Đang giao hàng` | Đơn hàng đang được giao             |
| `Đã giao hàng`   | Đơn hàng đã được giao thành công    |
| `Đã hủy`         | Đơn hàng đã bị hủy                  |
| `Hoàn tiền`      | Đơn hàng đã được hoàn tiền          |

### Trường `paymentType`

| Type                | Mô tả                          |
| ------------------- | ------------------------------ |
| `Tiền mặt`          | Thanh toán khi nhận hàng (COD) |
| `Thanh toán online` | Thanh toán qua cổng trực tuyến |

---

## User APIs

### 1. Tạo đơn hàng COD (Cash on Delivery)

- **URL:** `/cod`
- **Method:** `POST`
- **Authentication:** Required (User cookie JWT token)
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "items": [
    {
      "product": "69871113beab70df2d654457",
      "quantity": 2
    },
    {
      "product": "69871113beab70df2d65444f",
      "quantity": 1
    }
  ],
  "addressId": "6987f46ab40604b2485f6385"
}
```

**Chi tiết trường:**

- `items`: Mảng các sản phẩm trong đơn hàng
  - `product`: ID của sản phẩm (ObjectId)
  - `quantity`: Số lượng (mặc định: 1)
- `addressId`: ID của địa chỉ giao hàng (ObjectId)

**Cách tính tiền:**

- Tổng tiền = (offerPrice × quantity) + Thuế 2%

**Response Success (201):**

```json
{
  "success": true,
  "message": "Đặt hàng thành công",
  "order": {
    "_id": "65abc123456791",
    "userId": "65abc123456780",
    "address": {
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "email": "user@example.com",
      "phone": "0123456789",
      "street": "123 Đường ABC",
      "city": "Hà Nội",
      "state": "Quận Ba Đình",
      "zipCode": "10000",
      "country": "Việt Nam"
    },
    "items": [
      {
        "product": "60d5ecb54bbb4c001f8b4567",
        "name": "Táo Granny Smith",
        "image": "https://res.cloudinary.com/.../apple.jpg",
        "price": 50000,
        "offerPrice": 45000,
        "quantity": 2
      },
      {
        "product": "60d5ecb54bbb4c001f8b4568",
        "name": "Cam Sành",
        "image": "https://res.cloudinary.com/.../orange.jpg",
        "price": 30000,
        "offerPrice": 25000,
        "quantity": 1
      }
    ],
    "amount": 91800,
    "paymentType": "Tiền mặt",
    "status": "Đang xử lý",
    "isPaid": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

**Giải thích tính tiền:**

- Táo: 45000 × 2 = 90000
- Cam: 25000 × 1 = 25000
- Tổng phụ: 115000
- Thuế 2%: 2300
- **Tổng cộng: 115000 + 2300 = 117300**

**Response Error (400):**

```json
{
  "message": "Danh sách sản phẩm không hợp lệ"
}
```

```json
{
  "message": "Địa chỉ không hợp lệ"
}
```

```json
{
  "message": "Sản phẩm 60d5ecb54bbb4c001f8b4567 không tồn tại"
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

### 2. Lấy danh sách đơn hàng của User

- **URL:** `/user`
- **Method:** `GET`
- **Authentication:** Required (User cookie JWT token)

**Response Success (200):**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "65abc123456791",
      "userId": "65abc123456780",
      "address": {
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "email": "user@example.com",
        "phone": "0123456789",
        "street": "123 Đường ABC",
        "city": "Hà Nội",
        "state": "Quận Ba Đình",
        "zipCode": "10000",
        "country": "Việt Nam"
      },
      "items": [
        {
          "product": "60d5ecb54bbb4c001f8b4567",
          "name": "Táo Granny Smith",
          "image": "https://res.cloudinary.com/.../apple.jpg",
          "price": 50000,
          "offerPrice": 45000,
          "quantity": 2
        }
      ],
      "amount": 91800,
      "paymentType": "Tiền mặt",
      "status": "Đang xử lý",
      "isPaid": false,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    {
      "_id": "65abc123456792",
      "userId": "65abc123456780",
      "address": {
        "firstName": "Nguyễn",
        "lastName": "Văn B",
        "email": "user@example.com",
        "phone": "0987654321",
        "street": "456 Đường XYZ",
        "city": "TP. Hồ Chí Minh",
        "state": "Quận 1",
        "zipCode": "70000",
        "country": "Việt Nam"
      },
      "items": [
        {
          "product": "60d5ecb54bbb4c001f8b4569",
          "name": "Khoai tây",
          "image": "https://res.cloudinary.com/.../potato.jpg",
          "price": 25000,
          "offerPrice": 20000,
          "quantity": 3
        }
      ],
      "amount": 61200,
      "paymentType": "Tiền mặt",
      "status": "Đã giao hàng",
      "isPaid": true,
      "createdAt": "2023-12-28T10:00:00.000Z",
      "updatedAt": "2023-12-30T10:00:00.000Z"
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

## Seller/Admin APIs

### Authentication

Seller APIs yêu cầu Bearer token trong header:

```
Authorization: Bearer jwt_token_here
```

---

### 1. Lấy tất cả đơn hàng

- **URL:** `/seller`
- **Method:** `GET`
- **Authentication:** Required (Seller Bearer token)

**Response Success (200):**

```json
{
  "success": true,
  "orders": [
    {
      "_id": "65abc123456791",
      "userId": "65abc123456780",
      "address": {
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "email": "user@example.com",
        "phone": "0123456789",
        "street": "123 Đường ABC",
        "city": "Hà Nội",
        "state": "Quận Ba Đình",
        "zipCode": "10000",
        "country": "Việt Nam"
      },
      "items": [
        {
          "product": "60d5ecb54bbb4c001f8b4567",
          "name": "Táo Granny Smith",
          "image": "https://res.cloudinary.com/.../apple.jpg",
          "price": 50000,
          "offerPrice": 45000,
          "quantity": 2
        }
      ],
      "amount": 91800,
      "paymentType": "Tiền mặt",
      "status": "Đang xử lý",
      "isPaid": false,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

**Response Error (401):**

```json
{
  "message": "Token không hợp lệ"
}
```

**Response Error (500):**

```json
{
  "message": "Lỗi server"
}
```

---

### 2. Cập nhật trạng thái đơn hàng

- **URL:** `/status`
- **Method:** `POST`
- **Authentication:** Required (Seller Bearer token)
- **Content-Type:** `application/json`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body (Raw JSON):**

```json
{
  "orderId": "65abc123456791",
  "status": "Đã xác nhận"
}
```

**Các giá trị status hợp lệ:**

- `Đang xử lý`
- `Đã xác nhận`
- `Đang giao hàng`
- `Đã giao hàng`
- `Đã hủy`
- `Hoàn tiền`

**Response Success (200):**

```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "order": {
    "_id": "65abc123456791",
    "userId": "65abc123456780",
    "address": {
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "email": "user@example.com",
      "phone": "0123456789",
      "street": "123 Đường ABC",
      "city": "Hà Nội",
      "state": "Quận Ba Đình",
      "zipCode": "10000",
      "country": "Việt Nam"
    },
    "items": [
      {
        "product": "60d5ecb54bbb4c001f8b4567",
        "name": "Táo Granny Smith",
        "image": "https://res.cloudinary.com/.../apple.jpg",
        "price": 50000,
        "offerPrice": 45000,
        "quantity": 2
      }
    ],
    "amount": 91800,
    "paymentType": "Tiền mặt",
    "status": "Đã xác nhận",
    "isPaid": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response Error (404):**

```json
{
  "message": "Đơn hàng không tồn tại"
}
```

**Response Error (400):**

```json
{
  "message": "Trạng thái không hợp lệ"
}
```

**Response Error (401):**

```json
{
  "message": "Token không hợp lệ"
}
```

---

## Test Scenarios

### 1. Test Tạo Đơn hàng COD

1. Login user để lấy token (cookie)
2. Đảm bảo user có ít nhất 1 địa chỉ (tạo qua `/api/user/address/add`)
3. Gọi API `/cod` với items và addressId
4. Kiểm tra response 201 và đơn hàng được tạo
5. **Test error case:** Gửi items rỗng → response 400 "Danh sách sản phẩm không hợp lệ"
6. **Test error case:** Gửi addressId không tồn tại → response 400 "Địa chỉ không hợp lệ"
7. **Test error case:** Gửi productId không tồn tại → response 400 với ID sản phẩm
8. Kiểm tra tiền tự động tính đúng (offerPrice × quantity + thuế 2%)

### 2. Test Lấy Danh sách Đơn hàng (User)

1. Login user để lấy token (cookie)
2. Gọi API `/user`
3. Kiểm tra response 200 và danh sách đơn hàng của user
4. Test với user chưa có đơn hàng nào → trả về mảng rỗng `[]`
5. Verify đơn hàng được sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
6. Verify items có populate product thông tin (name, image, offerPrice, price)

### 3. Test Lấy Tất cả Đơn hàng (Seller)

1. Login seller để lấy Bearer token
2. Gọi API `/seller`
3. Kiểm tra response 200 và tất cả đơn hàng
4. Verify danh sách bao gồm đơn hàng của nhiều user khác nhau
5. **Test error case:** Không có token → response 401

### 4. Test Cập nhật Trạng thái Đơn hàng (Seller)

1. Login seller để lấy Bearer token
2. Gọi API `/status` với orderId và status mới
3. Kiểm tra response 200 và status được cập nhật
4. Test workflow hoàn chỉnh:
   - Tạo đơn hàng mới → status: "Đang xử lý"
   - Seller xác nhận → cập nhật status: "Đã xác nhận"
   - Bắt đầu giao → cập nhật status: "Đang giao hàng"
   - Giao thành công → cập nhật status: "Đã giao hàng"
5. **Test error case:** orderId không tồn tại → response 404

### 5. Test Workflow Hoàn chỉnh

**Bước 1: User chuẩn bị**

1. Login user
2. Thêm sản phẩm vào giỏ hàng (`POST /api/user/cart/update`)
3. Thêm địa chỉ giao hàng (`POST /api/user/address/add`)

**Bước 2: User đặt hàng**

1. Lấy danh sách địa chỉ (`GET /api/user/address/get`)
2. Lấy danh sách giỏ hàng từ user profile
3. Tạo đơn hàng COD (`POST /api/order/cod`)
4. Nhận orderId từ response

**Bước 3: Seller quản lý**

1. Login seller
2. Lấy tất cả đơn hàng (`GET /api/order/seller`)
3. Tìm đơn hàng vừa tạo
4. Cập nhật trạng thái qua các bước:
   - `POST /api/order/status` với "Đã xác nhận"
   - `POST /api/order/status` với "Đang giao hàng"
   - `POST /api/order/status` với "Đã giao hàng"

**Bước 4: User kiểm tra**

1. Login user
2. Lấy danh sách đơn hàng (`GET /api/order/user`)
3. Kiểm tra trạng thái đơn hàng đã được cập nhật

---

## Error Codes

- **400 Bad Request:** Dữ liệu đầu vào không hợp lệ (items rỗng, addressId không hợp lệ, sản phẩm không tồn tại)
- **401 Unauthorized:** Chưa đăng nhập hoặc token không hợp lệ/hết hạn
- **404 Not Found:** Đơn hàng không tồn tại
- **500 Internal Server Error:** Lỗi server (xem console log để debug)

---

## Notes

- Đơn hàng COD được tạo với `paymentType: "Tiền mặt"`
- Thuế 2% được tính tự động trên tổng tiền sản phẩm
- Khi tạo đơn hàng, thông tin address được copy vào order (không phải reference)
- Order items lưu thông tin sản phẩm tại thời điểm đặt hàng (snapshot)
- Trạng thái đơn hàng có thể cập nhật nhiều lần theo workflow
- Seller có thể xem tất cả đơn hàng từ mọi user
- User chỉ có thể xem đơn hàng của chính mình
- Danh sách đơn hàng được sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
- API tính tiền tự động dựa trên `offerPrice` (giá khuyến mãi) của sản phẩm
- Nếu sản phẩm không có `offerPrice`, sử dụng `price` thay thế
