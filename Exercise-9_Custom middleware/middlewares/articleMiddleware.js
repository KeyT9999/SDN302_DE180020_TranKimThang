function validateArticle(req, res, next) {
  const { title, date, text } = req.body;

  if (!title || !date || !text) {
    return res.status(400).json({
      message: 'Title, date and text are required'
    });
  }

  next();
}

function validateDate(req, res, next) {
  const { date } = req.body;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    return res.status(400).json({
      message: 'Date must be in YYYY-MM-DD format'
    });
  }

  next();
}

function validateTextLength(req, res, next) {
  const { text } = req.body;

  if (text.length < 10) {
    return res.status(400).json({
      message: 'Text must be at least 10 characters'
    });
  }

  next();
}

module.exports = {
  validateArticle,
  validateDate,
  validateTextLength
};
