# Hướng dẫn kiểm tra ứng dụng Exercise 27 (OAuth Facebook + JWT) bằng Postman

Ứng dụng kết hợp đăng nhập Facebook để nhận JWT token, sau đó dùng JWT token này để gửi kèm trong header các API RESTful của Articles nhằm bảo mật dữ liệu.

---

## 1. Lưu ý cấu hình SSL trên Postman
* **Cách xử lý:** Đi tới **Settings** (biểu tượng bánh răng) -> **General** -> Tắt mục **SSL certificate verification** (**OFF**).

---

## 2. Bước 1: Lấy JWT Token từ trình duyệt
1. Khởi động server (`node app.js`).
2. Mở trình duyệt và truy cập:
   ```txt
   https://localhost:3000/auth/facebook
   ```
3. Đăng nhập và xác thực tài khoản Facebook của bạn.
4. Sau khi đăng nhập thành công, trình duyệt sẽ hiển thị phản hồi dạng JSON chứa JWT Token như sau:
   ```json
   {
     "message": "Login Facebook successfully. Copy this token to Postman.",
     "tokenType": "Bearer",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIs...",
     "user": {
       "facebookId": "1234567890",
       "username": "Tên Của Bạn",
       "email": "email@example.com"
     }
   }
   ```
5. Hãy **sao chép (copy)** toàn bộ chuỗi ký tự trong thuộc tính `"token"`.

---

## 3. Bước 2: Thực hiện kiểm tra các API RESTful trên Postman

### API 1: Lấy danh sách tất cả các bài viết (Không cần Token)
* **Method:** `GET`
* **URL:** `https://localhost:3000/api/articles`
* **Headers:** Không cần truyền dữ liệu gì đặc biệt.
* **Kết quả mong đợi:** Trả về danh sách mặc định gồm 2 bài viết (Mã trạng thái `200 OK`).

### API 2: Tạo mới bài viết khi CHƯA có Token (Kiểm tra chặn bảo mật)
* **Method:** `POST`
* **URL:** `https://localhost:3000/api/articles`
* **Body:** Chọn tab **body** -> chọn **raw** -> chọn định dạng **JSON**, dán nội dung sau:
  ```json
  {
    "title": "Bài viết test bảo mật",
    "content": "Nội dung bài viết tạo từ Postman"
  }
  ```
* **Kết quả mong đợi:** Mã trạng thái `401 Unauthorized` kèm thông báo lỗi:
  ```json
  {
    "message": "Access denied. No token provided."
  }
  ```

### API 3: Tạo mới bài viết CÓ truyền kèm Token hợp lệ
* **Method:** `POST`
* **URL:** `https://localhost:3000/api/articles`
* **Thiết lập Authorization:**
  * Chọn tab **Authorization** ngay dưới thanh nhập URL.
  * Trong danh sách **Type**, chọn **Bearer Token**.
  * Dán mã JWT Token đã copy ở Bước 1 vào ô **Token**.
* **Body** (giống như trên):
  ```json
  {
    "title": "Bài viết OAuth 2",
    "content": "Nội dung bài viết mới"
  }
  ```
* **Kết quả mong đợi:** Mã trạng thái `201 Created` kèm thông tin người dùng được giải mã từ token và bài viết mới vừa được tạo:
  ```json
  {
    "message": "Create article successfully",
    "user": {
      "facebookId": "...",
      "username": "..."
    },
    "data": {
      "id": 3,
      "title": "Bài viết OAuth 2",
      "content": "Nội dung bài viết mới",
      "createdBy": "...",
      "username": "..."
    }
  }
  ```

### API 4: Cập nhật bài viết có truyền Token
* **Method:** `PUT`
* **URL:** `https://localhost:3000/api/articles/article/1` (Cập nhật bài viết có ID = 1)
* **Authorization:** Chọn kiểu **Bearer Token** và dán JWT Token vào.
* **Body** (raw JSON):
  ```json
  {
    "title": "Tiêu đề đã được cập nhật",
    "content": "Nội dung mới của bài viết 1"
  }
  ```
* **Kết quả mong đợi:** Trả về bài viết số 1 đã cập nhật thông tin mới (Mã trạng thái `200 OK`).

### API 5: Xóa bài viết có truyền Token
* **Method:** `DELETE`
* **URL:** `https://localhost:3000/api/articles/article/1` (Xóa bài viết có ID = 1)
* **Authorization:** Chọn kiểu **Bearer Token** và dán JWT Token vào.
* **Kết quả mong đợi:** Trả về bài viết bị xóa (Mã trạng thái `200 OK`). Gọi lại danh sách bài viết ở API 1 để xác nhận bài viết đã không còn nữa.
