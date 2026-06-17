# Hướng dẫn kiểm tra ứng dụng Exercise 28 (Upload and Download File) bằng Postman

Ứng dụng này sử dụng thư viện Multer để tải tệp tin lên máy chủ (Upload) và cho phép người dùng tải tệp tin về (Download) thông qua HTTPS.

---

## 1. Lưu ý cấu hình SSL trên Postman
* **Cách xử lý:** Đi tới **Settings** (biểu tượng bánh răng) -> **General** -> Tắt mục **SSL certificate verification** (**OFF**).

---

## 2. Kiểm tra tính năng tải tệp lên (Upload File)
Để upload một file lên server qua Postman, ta sử dụng định dạng dữ liệu `multipart/form-data`:

1. Đảm bảo server đang chạy (`node app.js`).
2. Mở Postman, chọn phương thức và nhập URL:
   * **Method:** `POST`
   * **URL:** `https://localhost:3000/api/upload`
3. Nhấp vào tab **Body** nằm ngay dưới thanh nhập URL.
4. Chọn định dạng gửi là **form-data**.
5. Thêm cấu hình tham số:
   * **Key:** Nhập chữ `file` (lưu ý: key này bắt buộc phải viết đúng chữ `file`, không viết hoa hay đổi từ khác, vì khớp với cấu hình `upload.single('file')` trong code router).
   * **Type của Key:** Di chuyển chuột đến bên phải ô Key vừa nhập, bạn sẽ thấy một dropdown chuyển đổi giữa `Text` và `File`. Hãy chọn **File**.
   * **Value:** Click vào nút **Select Files** vừa xuất hiện và chọn một file bất kỳ từ máy tính của bạn (hình ảnh, tài liệu PDF, tệp văn bản...).
6. Nhấn nút **Send**.
7. **Kết quả mong đợi:** Server trả về phản hồi thành công (Mã trạng thái `200 OK`) với thông tin dạng JSON:
   ```json
   {
     "message": "File uploaded successfully.",
     "originalName": "avatar.png",
     "savedName": "avatar-1718600000000.png",
     "size": 12345,
     "downloadUrl": "/api/download/avatar-1718600000000.png"
   }
   ```
8. **Kiểm chứng:** Hãy sao chép chuỗi trong thuộc tính `"savedName"` để test tiếp. Đồng thời bạn cũng sẽ thấy file được upload xuất hiện bên trong thư mục `uploads/` của dự án.

---

## 3. Kiểm tra tính năng tải tệp về (Download File)

 Sau khi có tên file đã lưu ở máy chủ (savedName), bạn có thể tiến hành test tải xuống:

### Cách A: Tải tệp thông qua API Download của Postman
1. Tạo request mới trên Postman:
   * **Method:** `GET`
   * **URL:** `https://localhost:3000/api/download/<savedName>` (Ví dụ: `https://localhost:3000/api/download/avatar-1718600000000.png`)
2. Nhấn nút **Send**.
3. **Kết quả mong đợi:** Postman tải file xuống thành công và hiển thị giao diện nội dung file (nếu là ảnh/văn bản) hoặc trả về file nhị phân. Bạn cũng có thể chọn mũi tên cạnh nút Send -> **Send and Download** để lưu trực tiếp file về máy tính qua Postman.

### Cách B: Mở trực tiếp trên Trình duyệt để tải về
1. Sao chép link download đầy đủ: `https://localhost:3000/api/download/<savedName>`.
2. Dán link này vào thanh địa chỉ của trình duyệt web của bạn và nhấn Enter.
3. **Kết quả mong đợi:** Trình duyệt sẽ tự động kích hoạt tính năng tải xuống tệp tin đó về thư mục Downloads của bạn.

---

## 4. Truy cập tệp tĩnh (Static URL)
Ứng dụng có hỗ trợ static routing truy cập trực tiếp file không cần qua cơ chế tải xuống của Express:
* Bạn truy cập URL trình duyệt:
  ```txt
  https://localhost:3000/uploads/<savedName>
  ```
  Nếu tệp tin là hình ảnh, trình duyệt sẽ trực tiếp hiển thị bức ảnh đó trên màn hình thay vì tải tệp xuống.
