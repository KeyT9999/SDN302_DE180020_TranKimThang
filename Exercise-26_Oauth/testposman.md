# Hướng dẫn kiểm tra ứng dụng Exercise 26 (OAuth Facebook) bằng Postman & Trình duyệt

Vì xác thực OAuth Facebook yêu cầu người dùng đăng nhập qua giao diện web của Facebook, quy trình kiểm tra sẽ kết hợp trình duyệt web và công cụ Postman.

---

## 1. Lưu ý cấu hình SSL trên Postman
Vì ứng dụng chạy trên giao thức HTTPS với chứng chỉ tự ký (self-signed certificate) ở môi trường phát triển localhost, Postman có thể chặn kết nối.
* **Cách xử lý:** Trong Postman, đi tới **Settings** (biểu tượng bánh răng) -> **General** -> Tắt mục **SSL certificate verification** (**OFF**).

---

## 2. Bước 1: Thực hiện đăng nhập trên Trình duyệt
Postman thông thường không thể xử lý tốt việc hiển thị giao diện đăng nhập web của Facebook. Do đó, bạn cần đăng nhập qua trình duyệt trước:

1. Đảm bảo server đang chạy (`node app.js`).
2. Mở trình duyệt web của bạn và truy cập đường dẫn:
   ```txt
   https://localhost:3000/auth/facebook
   ```
3. Nếu trình duyệt cảnh báo *"Your connection is not private"*, nhấn **Advanced** (Nâng cao) -> **Proceed to localhost** (Tiếp tục truy cập).
4. Bạn sẽ được chuyển hướng tới trang đăng nhập của Facebook. Nhập tài khoản và mật khẩu Facebook test của bạn và nhấn đồng ý cấp quyền truy cập.
5. Sau khi xác thực thành công, Facebook chuyển hướng ngược lại server của bạn tại route callback, và bạn sẽ được chuyển đến trang Profile thành công:
   ```txt
   https://localhost:3000/profile
   ```
   Trang web sẽ hiển thị thông tin tài khoản Facebook của bạn:
   * **ID:** (Mã định danh tài khoản Facebook)
   * **Name:** (Tên hiển thị)
   * **Email:** (Email liên kết, hoặc `No email returned` nếu tài khoản không chia sẻ email công khai).

---

## 3. Bước 2: Kiểm tra các Route trên Postman (Sử dụng Cookie Session)
Khi bạn đã đăng nhập ở trình duyệt, thông tin đăng nhập được lưu trữ qua Session Cookie. Để kiểm tra các route bảo mật trên Postman, bạn có hai cách:

### Cách A: Test trực tiếp các API trên trình duyệt
* **Xem thông tin Profile:** Truy cập `https://localhost:3000/profile` (Sẽ hiển thị thông tin nếu đã đăng nhập thành công).
* **Đăng xuất:** Truy cập `https://localhost:3000/logout` (Sẽ xóa Session và chuyển bạn về trang chủ). Sau khi logout, nếu bạn cố tình truy cập lại `/profile`, hệ thống sẽ tự động chuyển hướng bạn quay lại trang đăng nhập Facebook.

### Cách B: Đồng bộ Cookie vào Postman để gọi API
1. Sử dụng tính năng **Cookie Manager** trong Postman (nút **Cookies** nằm ở góc trên bên phải khung làm việc, dưới nút Send).
2. Thêm domain `localhost` và thêm cookie `connect.sid` (lấy từ Developer Tools của trình duyệt sau khi đăng nhập thành công).
3. Gửi request:
   * **Method:** `GET`
   * **URL:** `https://localhost:3000/profile`
   * **Kết quả mong đợi:** Mã trạng thái `200 OK` kèm theo giao diện HTML chứa thông tin cá nhân.
4. Gửi request đăng xuất:
   * **Method:** `GET`
   * **URL:** `https://localhost:3000/logout`
   * **Kết quả mong đợi:** Session bị xóa trên server, gọi lại `/profile` sau đó sẽ trả về chuyển hướng đăng nhập.
