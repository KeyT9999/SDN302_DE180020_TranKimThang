const express = require('express');
const articleRouter = express.Router();

const articles = [
  {
    id: 1,
    title: 'My Favorite Vacation',
    date: '2024-03-03',
    text: 'We spent seven days in Italy...'
  }
];

articleRouter.get('/', (req, res) => {
  res.status(200).json(articles);
});

articleRouter.post('/', (req, res, next) => {
  try {
    const { title, date, text } = req.body;

    if (!title || !date || !text) {
      const err = new Error('Article title, date and text are required');
      err.status = 400;
      return next(err);
    }

    const newArticle = {
      id: articles.length + 1,
      title,
      date,
      text
    };

    articles.push(newArticle);

    res.status(201).json({
      message: 'Article created successfully',
      data: newArticle
    });
  } catch (err) {
    next(err);
  }
});

articleRouter.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const article = articles.find(item => item.id === id);

    if (!article) {
      const err = new Error('Article not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
});

module.exports = articleRouter;
