# QuyXanh API Test Examples

Dưới đây là các ví dụ cách test API bằng curl hoặc Postman.

## 1. Health Check

```bash
curl -X GET http://localhost:3001/health
```

## 2. Đăng ký tài khoản mới

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User",
    "phoneNumber": "0987654321"
  }'
```

## 3. Xác thực email (thay 123456 bằng mã nhận được qua email)

```bash
curl -X POST http://localhost:3001/api/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

## 4. Đăng nhập

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "Test123456"
  }'
```

## 5. Lấy thông tin profile (cần access token từ bước đăng nhập)

```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 6. Quên mật khẩu

```bash
curl -X POST http://localhost:3001/api/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 7. Reset mật khẩu (thay 123456 bằng mã nhận được qua email)

```bash
curl -X POST http://localhost:3001/api/users/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456",
    "newPassword": "NewPassword123"
  }'
```

## 8. Đổi mật khẩu (cần đăng nhập)

```bash
curl -X POST http://localhost:3001/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "currentPassword": "Test123456",
    "newPassword": "NewPassword123"
  }'
```

## 9. Đăng xuất (cần đăng nhập)

```bash
curl -X POST http://localhost:3001/api/users/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 10. Refresh token

```bash
curl -X POST http://localhost:3001/api/users/refresh-token \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

## Google OAuth

Truy cập trực tiếp qua browser:

```
http://localhost:3001/api/users/auth/google
```

---

### Postman Collection

Bạn có thể import các request trên vào Postman bằng cách:

1. Mở Postman
2. Click "Import"
3. Tạo collection mới
4. Copy các curl commands trên và paste vào Postman

### Notes:

- Thay `YOUR_ACCESS_TOKEN` bằng token thực tế từ response đăng nhập
- Để test Google OAuth, cần truy cập qua browser
- Cookies được tự động quản lý bởi browser cho refresh token
