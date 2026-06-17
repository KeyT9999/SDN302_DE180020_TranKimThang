const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Đường dẫn thư mục uploads
const uploadDir = path.join(__dirname, '..', 'uploads');

// Nếu chưa có thư mục uploads thì tự tạo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // File sẽ được lưu vào thư mục uploads
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // Lấy phần mở rộng file, ví dụ .jpg, .png, .pdf
    const ext = path.extname(file.originalname);

    // Lấy tên file gốc, bỏ phần mở rộng
    const baseName = path.basename(file.originalname, ext);

    // Tạo tên file mới để tránh trùng tên
    const newFileName = baseName + '-' + Date.now() + ext;

    cb(null, newFileName);
  }
});

// Cấu hình Multer
const upload = multer({
  storage: storage
});

// =======================
// UPLOAD SINGLE FILE
// =======================
// Field name trong Postman phải là "file"
router.post('/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file was uploaded.'
    });
  }

  res.status(200).json({
    message: 'File uploaded successfully.',
    originalName: req.file.originalname,
    savedName: req.file.filename,
    size: req.file.size,
    downloadUrl: `/api/download/${req.file.filename}`
  });
});

// =======================
// DOWNLOAD FILE
// =======================
router.get('/download/:filename', function (req, res) {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      message: 'File not found.'
    });
  }

  res.download(filePath, filename, function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Download failed.',
        error: err.message
      });
    }
  });
});

module.exports = router;
