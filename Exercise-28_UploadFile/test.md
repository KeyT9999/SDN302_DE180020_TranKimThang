# Hướng dẫn kiểm tra ứng dụng Exercise 28 (Upload and Download File) bằng Postman

Ứng dụng này sử dụng thư viện **Multer** để tải tệp tin lên máy chủ (Upload) và cho phép người dùng tải tệp tin về (Download) qua HTTPS.

---

## 1. Lưu ý quan trọng khi cấu hình SSL trên Postman
Vì ứng dụng chạy trên giao thức HTTPS tự ký (`https://localhost:3000`), Postman sẽ chặn yêu cầu nếu chưa tắt xác thực SSL.
* **Cách xử lý:** Đi tới biểu tượng **Settings** (bánh răng ở góc trên bên phải) -> Chọn **General** -> Tắt mục **SSL certificate verification** (chuyển sang **OFF**).

---

## 2. Cách kiểm tra tính năng tải tệp lên (Upload File)

Để upload một file lên server qua Postman, ta sử dụng định dạng dữ liệu `multipart/form-data`:

1. Đảm bảo server đang chạy (`npm run dev` hoặc `node app.js`).
2. Mở Postman, tạo một Request mới:
   * **Method:** `POST`
   * **URL:** `https://localhost:3000/api/upload`
3. Nhấp vào tab **Body** (nằm ngay dưới thanh nhập URL).
4. Chọn định dạng gửi là **form-data**.
5. Cấu hình tham số gửi file (LƯU Ý KỸ PHẦN NÀY ĐỂ TRÁNH LỖI):
   * Chỉ tạo **1 dòng duy nhất** có dấu check ở đầu dòng.
   * **Key:** Nhập chữ `file` (bắt buộc viết thường, đúng chữ `file`).
   * **Type của Key:** Di chuyển chuột đến bên phải ô Key vừa nhập, bạn sẽ thấy một dropdown chuyển đổi giữa `Text` và `File`. Chọn **File**.
   * **Value:** Click vào nút **Select Files** vừa xuất hiện và chọn một file bất kỳ từ máy tính của bạn (hình ảnh `1.png`, tài liệu PDF, v.v.).
6. Nhấn nút **Send**.
7. **Kết quả mong đợi:** Server trả về phản hồi thành công (Mã trạng thái `200 OK`) với thông tin dạng JSON:
   ```json
   {
     "message": "File uploaded successfully.",
     "originalName": "1.png",
     "savedName": "1-1718600000000.png",
     "size": 12345,
     "downloadUrl": "/api/download/1-1718600000000.png"
   }
   ```
8. Hãy sao chép chuỗi trong thuộc tính `"savedName"` để kiểm tra tiếp phần tải về. Tệp tin được upload cũng sẽ xuất hiện trong thư mục `uploads/` của dự án.

---

## 3. Cách sửa lỗi "MulterError: Field name missing" (500 Internal Server Error)

### Nguyên nhân lỗi:
Lỗi này xảy ra khi Postman gửi file lên nhưng **không đặt tên cho trường (Key) chứa file đó** (để trống cột Key), khiến thư viện Multer ở server không tìm thấy tên field.

Như trong hình ảnh của bạn:
* Dòng 1: Bạn đặt **Key** là `file` nhưng kiểu dữ liệu bên cạnh lại chọn là **Text** và để trống giá trị.
* Dòng 2: Bạn chọn kiểu dữ liệu là **File** và chọn ảnh `1.png` thành công, nhưng lại **bỏ trống ô Key**.

### Cách khắc phục trên Postman:
1. Rê chuột vào hàng thứ nhất (dòng Text trống) và nhấn biểu tượng dấu **x** ở cuối dòng để xóa nó đi.
2. Tại hàng thứ hai (dòng chứa file `1.png`):
   * Nhấp chuột vào cột **Key** và gõ chữ `file`.
   * Đảm bảo kiểu dữ liệu bên phải vẫn là **File** và tệp `1.png` đã được chọn.
3. Nhấn **Send** lại là thành công.

*Hình ảnh minh họa thiết lập đúng:*
- **Key:** `file` | **Type:** `File` | **Value:** `[chọn tệp tin 1.png]`

---

## 4. Kiểm tra tính năng tải tệp về (Download File)

Sau khi upload thành công và nhận được tên file đã lưu ở máy chủ (`savedName`), bạn có thể tiến hành test tải xuống:

### Cách A: Tải tệp thông qua API Download của Postman
1. Tạo request mới trên Postman:
   * **Method:** `GET`
   * **URL:** `https://localhost:3000/api/download/<savedName>` (Ví dụ: `https://localhost:3000/api/download/1-1718600000000.png`)
2. Nhấn nút **Send**.
3. **Kết quả mong đợi:** Postman tải file xuống thành công. Nếu bạn muốn lưu file về máy tính qua Postman, hãy nhấn vào mũi tên nhỏ bên cạnh nút **Send** -> Chọn **Send and Download**.

### Cách B: Mở trực tiếp trên Trình duyệt để tải về
1. Sao chép link download đầy đủ: `https://localhost:3000/api/download/<savedName>`.
2. Dán link này vào thanh địa chỉ của trình duyệt web của bạn và nhấn Enter.
3. Trình duyệt sẽ tự động kích hoạt tính năng tải xuống tệp tin đó về thư mục Downloads của bạn.

---

## 5. Truy cập tệp tĩnh trực tiếp (Static URL)
Bạn cũng có thể truy cập trực tiếp file tĩnh không cần qua controller download bằng URL sau trên trình duyệt:
```txt
https://localhost:3000/uploads/<savedName>
```
Nếu tệp tin là hình ảnh, trình duyệt sẽ trực tiếp hiển thị bức ảnh đó trên màn hình.

---

## 6. Cách sửa lỗi "File not found" (404 Not Found) khi tải tệp về

### Nguyên nhân lỗi:
Lỗi này xảy ra khi bạn gọi API Download với tên file gốc (ví dụ: `1.png`) thay vì tên file đã được lưu trên hệ thống kèm timestamp (ví dụ: `1-1782100706854.png`).

Trong code backend (`routes/uploadRouter.js`), để tránh trùng tên file khi có nhiều người upload cùng một file, hệ thống sẽ tự động đổi tên file theo định dạng:
`[tên_file_gốc]-[timestamp].[phần_mở_rộng]`

Vì vậy, file `1.png` của bạn khi tải lên đã được đổi tên thành một chuỗi như `1-1782100706854.png`. Khi bạn gọi `https://localhost:3000/api/download/1.png`, server tìm trong thư mục `uploads/` không thấy file nào tên là `1.png` nên báo **404 Not Found**.

### Cách khắc phục:
1. Hãy xem lại kết quả trả về (Response Body dạng JSON) của request **POST Upload** trước đó, tìm giá trị của key `"savedName"`.
2. Sử dụng đúng tên này trong URL tải về.
   - **Ví dụ đúng:** `https://localhost:3000/api/download/1-1782100706854.png` (Thay thế cụm số timestamp tương ứng với file của bạn).

