require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.getToken = function (user) {
  return jwt.sign(
    user,
    process.env.JWT_SECRET,
    {
      expiresIn: 3600
    }
  );
};

exports.verifyUser = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Token format is invalid. Use: Bearer <token>'
    });
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = decoded;
    next();
  });
};

exports.verifyAdmin = function (req, res, next) {
  if (req.user && req.user.admin === true) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You are not authorized to perform this operation'
  });
};
