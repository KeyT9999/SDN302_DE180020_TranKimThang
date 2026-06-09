function authenticate(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: 'Bạn chưa đăng nhập'
    });
  }

  next();
}

module.exports = authenticate;
