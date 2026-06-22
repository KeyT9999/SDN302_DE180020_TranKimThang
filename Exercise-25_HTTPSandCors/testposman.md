# Hướng dẫn kiểm tra tính năng CORS & HTTPS (Exercise 25) bằng Postman

Ứng dụng của bạn sử dụng middleware CORS tự cấu hình trong [cors.js](file:///f:/LEARN%20K%C3%8C%207/SDN302%20Node%20JS/SDN302_DE180020_TranKimThang/Exercise-25_HTTPSandCors/routes/cors.js) để kiểm tra header `Origin` của Request gửi đến. 

Vì Postman không phải là trình duyệt nên mặc định nó sẽ không tự động kiểm tra CORS. Tuy nhiên, chúng ta có thể giả lập hành vi của trình duyệt bằng cách thủ công thêm header `Origin` để kiểm tra.

---

## 1. Chuẩn bị trước khi test
1. Đảm bảo dịch vụ MongoDB của bạn đang hoạt động.
2. Khởi động server (`npm start` hoặc `npm run dev` trong thư mục [Exercise-25_HTTPSandCors](file:///f:/LEARN%20K%C3%8C%207/SDN302%20Node%20JS/SDN302_DE180020_TranKimThang/Exercise-25_HTTPSandCors)).
3. **Cực kỳ quan trọng:** Đảm bảo đã tắt **SSL Verification** trên Postman (Vào **Settings** -> **General** -> chuyển **SSL certificate verification** thành **OFF**).

---

## 2. Các trường hợp kiểm thử (Test Cases)

### Trường hợp 1: Request bình thường không truyền header Origin (Bỏ qua CORS)
Khi client là app di động, Postman hoặc server-to-server gọi trực tiếp (không thông qua trình duyệt), header `Origin` sẽ bị thiếu. Server sẽ cho phép truy cập bình thường.
* **Method:** `GET`
* **URL:** `https://localhost:3443/articles`
* **Headers:** Không cấu hình header `Origin`.
* **Kết quả mong đợi:** Mã trạng thái `200 OK` (danh sách bài viết). Response Headers sẽ **không** chứa các trường `Access-Control-Allow-Origin`.

---

### Trường hợp 2: Request chứa Origin hợp lệ (Được phép truy cập)
Giả lập một website hợp lệ (như Frontend React đang chạy ở `https://localhost:3000`) gọi API.
* **Method:** `GET`
* **URL:** `https://localhost:3443/articles`
* **Headers:** Click vào tab **Headers**, thêm một hàng mới:
  * **Key:** `Origin`
  * **Value:** `https://localhost:3000`
* **Kết quả mong đợi:** Mã trạng thái `200 OK`. 
* Khi xem tab **Headers của Response** (phần kết quả trả về bên dưới), bạn sẽ thấy các header CORS sau được trả về:
  * `Access-Control-Allow-Origin: https://localhost:3000`
  * `Access-Control-Allow-Credentials: true`
  * `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

---

### Trường hợp 3: Request chứa Origin KHÔNG hợp lệ (Bị chặn CORS)
Giả lập một trang web lạ/độc hại cố tình gọi tới API của bạn.
* **Method:** `GET`
* **URL:** `https://localhost:3443/articles`
* **Headers:** Click vào tab **Headers**, sửa lại hàng Origin:
  * **Key:** `Origin`
  * **Value:** `https://google.com` (hoặc bất kỳ tên miền nào khác ngoài danh sách allowedOrigins)
* **Kết quả mong đợi:** Mã trạng thái `403 Forbidden` kèm lỗi định dạng JSON:
  ```json
  {
    "success": false,
    "message": "Origin https://google.com is not allowed by CORS"
  }
  ```

---

### Trường hợp 4: Preflight Request (OPTIONS)
Trình duyệt trước khi thực hiện các method thay đổi dữ liệu (`POST`, `PUT`, `DELETE`) sẽ tự động gửi trước một request OPTIONS (gọi là Preflight Request) để kiểm tra xem server có hỗ trợ CORS cho origin đó không.
* **Method:** `OPTIONS`
* **URL:** `https://localhost:3443/articles`
* **Headers:**
  * **Key:** `Origin`
  * **Value:** `https://localhost:3000`
* **Kết quả mong đợi:** Mã trạng thái `200 OK`. Response headers phải trả về đầy đủ các thông tin CORS như `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, v.v.
