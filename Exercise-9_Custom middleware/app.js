const express = require('express');

const {
  validateArticle,
  validateDate,
  validateTextLength
} = require('./middlewares/articleMiddleware');

const app = express();
const port = 3000;

app.use(express.json());

const articles = [];

app.get('/', (req, res) => {
  res.send('Exercise 8: Custom Middleware');
});

app.get('/articles', (req, res) => {
  res.json(articles);
});

app.post(
  '/articles',
  validateArticle,
  validateDate,
  validateTextLength,
  (req, res) => {
    const { title, date, text } = req.body;

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
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
