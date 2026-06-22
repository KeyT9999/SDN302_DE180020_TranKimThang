# Hướng dẫn cấu hình Google OAuth và kiểm tra ứng dụng bằng Postman

Ứng dụng này sử dụng **Google OAuth 2.0** thay thế cho Facebook Login để xác thực người dùng, cấp mã **JWT Token**, và bảo vệ các API RESTful của Articles.

---

## 1. Hướng dẫn lấy GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET
Bạn cần đăng ký ứng dụng trên Google Cloud Console:

1. **Truy cập Google Cloud Console:**
   * Vào trang [Google Cloud Console](https://console.cloud.google.com/) và đăng nhập bằng tài khoản Google.
2. **Tạo Project mới:**
   * Nhấp chọn tên Project ở góc trên bên trái -> Chọn **New Project** (Dự án mới), đặt tên bất kỳ và bấm **Create**.
3. **Cấu hình Màn hình chấp thuận OAuth (OAuth consent screen):**
   * Vào Menu bên trái -> **APIs & Services** -> **OAuth consent screen**.
   * Chọn User Type là **External** -> Bấm **Create**.
   * Điền thông tin bắt buộc: **App name** (Tên ứng dụng), **User support email**, và **Developer contact information** (Email của bạn). Bấm **Save and Continue** qua các bước kế tiếp mà không cần điền thêm thông tin khác cho đến khi hoàn tất.
4. **Tạo thông tin xác thực (Credentials):**
   * Vào mục **Credentials** từ Menu trái -> Nhấp **Create Credentials** ở trên cùng -> Chọn **OAuth client ID**.
   * Chọn **Application type** là **Web application** (Ứng dụng web).
   * **Cấu hình URL (Rất quan trọng):**
     * Tại mục **Authorized JavaScript origins**, nhấn **Add URI** và nhập:
       ```txt
       https://localhost:3000
       ```
     * Tại mục **Authorized redirect URIs**, nhấn **Add URI** và nhập chính xác:
       ```txt
       https://localhost:3000/auth/google/callback
       ```
   * Nhấn **Create**.
5. **Sao chép Credentials:**
   * Một hộp thoại hiện lên chứa **Your Client ID** và **Your Client Secret**.
   * Sao chép hai giá trị này và dán vào tệp [.env](file:///f:/LEARN%20K%C3%8C%207/SDN302%20Node%20JS/SDN302_DE180020_TranKimThang/OauthGoogle/.env):
     ```env
     GOOGLE_CLIENT_ID=your_client_id_vừa_copy
     GOOGLE_CLIENT_SECRET=your_client_secret_vừa_copy
     ```

---

## 2. Lưu ý cấu hình SSL trên Postman
* **Cách xử lý:** Đi tới **Settings** (biểu tượng bánh răng) -> **General** -> Tắt mục **SSL certificate verification** (**OFF**).

---

## 3. Bước 1: Lấy JWT Token từ trình duyệt
1. Khởi động server (`npm run dev` hoặc `npm start`).
2. Mở trình duyệt web và truy cập đường dẫn:
   ```txt
   https://localhost:3000/auth/google
   ```
3. Đăng nhập tài khoản Gmail/Google của bạn.
4. Sau khi đăng nhập thành công, trình duyệt sẽ hiển thị phản hồi dạng JSON chứa JWT Token:
   ```json
   {
     "message": "Login Google successfully. Copy this token to Postman.",
     "tokenType": "Bearer",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIs...",
     "user": {
       "googleId": "1028374829374892",
       "username": "Tên Tài Khoản Google",
       "email": "username@gmail.com"
     }
   }
   ```
5. Hãy **sao chép (copy)** toàn bộ chuỗi ký tự trong thuộc tính `"token"`.

---

## 4. Bước 2: Gọi các API Articles bằng Postman

### API 1: Lấy danh sách tất cả các bài viết (Không cần Token)
* **Method:** `GET`
* **URL:** `https://localhost:3000/api/articles`
* **Kết quả mong đợi:** Trạng thái `200 OK` hiển thị mảng chứa các bài viết mặc định.

### API 2: Tạo mới bài viết CHƯA có Token (Kiểm tra chặn bảo mật)
* **Method:** `POST`
* **URL:** `https://localhost:3000/api/articles`
* **Body (raw JSON):**
  ```json
  {
    "title": "Google OAuth Article",
    "content": "Nội dung bài viết tạo từ tài khoản Google"
  }
  ```
* **Kết quả mong đợi:** Mã trạng thái `401 Unauthorized` kèm thông báo lỗi: `"Access denied. No token provided."`

### API 3: Tạo mới bài viết CÓ truyền kèm Token hợp lệ
* **Method:** `POST`
* **URL:** `https://localhost:3000/api/articles`
* **Thiết lập Authorization:**
  * Chọn tab **Authorization** -> chọn Type là **Bearer Token**.
  * Dán mã JWT Token đã copy từ trình duyệt vào ô **Token**.
* **Body** (giống như trên) -> Nhấn **Send**.
* **Kết quả mong đợi:** Trạng thái `201 Created` chứa bài viết mới với thuộc tính `createdBy` là ID Google của bạn.

### API 4: Cập nhật bài viết
* **Method:** `PUT`
* **URL:** `https://localhost:3000/api/articles/article/1`
* **Authorization:** Kiểu **Bearer Token** và dán JWT Token vào.
* **Body (raw JSON):**
  ```json
  {
    "title": "Cập nhật bài viết bởi Google User"
  }
  ```
* **Kết quả mong đợi:** Trả về bài viết số 1 đã cập nhật tiêu đề mới (Trạng thái `200 OK`).

### API 5: Xóa bài viết
* **Method:** `DELETE`
* **URL:** `https://localhost:3000/api/articles/article/1`
* **Authorization:** Kiểu **Bearer Token** và dán JWT Token vào.
* **Kết quả mong đợi:** Trả về bài viết bị xóa (Trạng thái `200 OK`).
