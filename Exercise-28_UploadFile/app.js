const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const uploadRouter = require('./routes/uploadRouter');

const app = express();
const PORT = 3000;

// Middleware đọc JSON và form urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mặc định
app.get('/', function (req, res) {
  res.send(`
    <h1>Exercise 28: Upload and Download File</h1>
    <p>Upload API: POST /api/upload</p>
    <p>Download API: GET /api/download/:filename</p>
  `);
});

// Sử dụng upload router
app.use('/api', uploadRouter);

// Cho phép truy cập static nếu muốn mở file trực tiếp qua URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cấu hình HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt'))
};

// Start HTTPS server
https.createServer(options, app).listen(PORT, function () {
  console.log(`HTTPS server is running at https://localhost:${PORT}`);
});
