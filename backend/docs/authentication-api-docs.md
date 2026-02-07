# Green Cart - Authentication APIs

**Base URL:** `http://localhost:5000`

## User Authentication

### 1. Register User

- **URL:** `/api/user/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

**Response Error (400):**

```json
{
  "message": "Email đã được sử dụng"
}
```

---

### 2. Login User

- **URL:** `/api/user/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

**Response Error (401):**

```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

> **Lưu ý:** Token được lưu tự động vào cookie

---

### 3. Check User Auth

- **URL:** `/api/user/is-auth`
- **Method:** `GET`
- **Authentication:** Cookie chứa JWT token (tự động gửi)

**Response Success (200):**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. Logout User

- **URL:** `/api/user/logout`
- **Method:** `GET`
- **Authentication:** Cookie chứa JWT token (tự động gửi)

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## Seller Authentication

**Seller Credentials từ .env:**

- Email: `admin@example.com`
- Password: `greatstack123`

---

### 1. Login Seller

- **URL:** `/api/seller/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body (Raw JSON):**

```json
{
  "email": "admin@example.com",
  "password": "greatstack123"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng nhập seller thành công",
  "token": "Bearer jwt_token_here"
}
```

---

### 2. Check Seller Auth

- **URL:** `/api/seller/is-auth`
- **Method:** `GET`
- **Authentication:** Bearer token trong header

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response Success (200):**

```json
{
  "success": true,
  "isAuthenticated": true,
  "seller": {
    "role": "seller"
  }
}
```

---

### 3. Logout Seller

- **URL:** `/api/seller/logout`
- **Method:** `GET`

**Response Success (200):**

```json
{
  "success": true,
  "message": "Đăng xuất seller thành công"
}
```

> **Lưu ý:** Client cần xóa token khỏi localStorage/sessionStorage

---
