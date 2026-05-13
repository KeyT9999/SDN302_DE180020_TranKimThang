const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log('Request for ' + req.url + ' by method ' + req.method);

    if (req.method == 'GET') {
        var fileUrl;

        // Nếu URL là '/', mặc định trả về index.html
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;

        // Ánh xạ URL -> đường dẫn thực trên máy chủ (thư mục public)
        var filePath = path.resolve('./public' + fileUrl);

        // Lấy đuôi mở rộng của file (.html, .css, ...)
        const fileExt = path.extname(filePath);

        // Chỉ phục vụ file .html
        if (fileExt == '.html') {
            // Kiểm tra file có tồn tại không
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    // File không tồn tại → 404
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>');
                    return;
                }

                // File tồn tại → trả về nội dung
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        } else {
            // Đuôi file không phải .html → 404
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error 404: ' + fileUrl + ' not a HTML file</h1></body></html>');
        }
    } else {
        // Method không phải GET → 404
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + req.method + ' not supported</h1></body></html>');
    }
});

server.listen(PORT, () => {
    console.log('Server is running at http://localhost:' + PORT);
});
