const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Cấu hình Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Lưu user id vào session
passport.serializeUser(User.serializeUser());

// Lấy user từ session ra req.user
passport.deserializeUser(User.deserializeUser());

// Middleware kiểm tra đăng nhập
exports.verifyUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'You are not authenticated. Please login first.'
  });
};

// Middleware kiểm tra admin nếu cần
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You are not authorized to perform this operation.'
  });
};
