const jwt = require('jsonwebtoken');

function verifyJwtToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  // Format chuẩn: Authorization: Bearer <token>
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Invalid token format. Use Bearer token.'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user sau khi decode token
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
}

module.exports = verifyJwtToken;
