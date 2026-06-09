const express = require('express');
const router = express.Router();
const authenticate = require('../authentication/auth');

router.get('/', authenticate, (req, res) => {
  res.json({
    message: 'Danh sách articles',
    user: req.session.user
  });
});

router.post('/', authenticate, (req, res) => {
  res.json({
    message: 'Tạo article thành công'
  });
});

module.exports = router;
