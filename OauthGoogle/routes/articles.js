const express = require('express');
const router = express.Router();
const verifyJwtToken = require('../middleware/authJwt');

let articles = [
  {
    id: 1,
    title: 'First Google OAuth Article',
    content: 'This is the first article.'
  },
  {
    id: 2,
    title: 'Second Google OAuth Article',
    content: 'This is the second article.'
  }
];

// GET: không cần token
router.get('/', (req, res) => {
  res.json({
    message: 'Get all articles successfully',
    data: articles
  });
});

// GET by ID: không cần token
router.get('/article/:id', (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find(item => item.id === id);

  if (!article) {
    return res.status(404).json({
      message: 'Article not found'
    });
  }

  res.json({
    message: 'Get article successfully',
    data: article
  });
});

// POST: cần JWT token
router.post('/', verifyJwtToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'Title and content are required'
    });
  }

  const newArticle = {
    id: articles.length + 1,
    title,
    content,
    createdBy: req.user.googleId,
    username: req.user.username
  };

  articles.push(newArticle);

  res.status(201).json({
    message: 'Create article successfully',
    user: req.user,
    data: newArticle
  });
});

// PUT: cần JWT token
router.put('/article/:id', verifyJwtToken, (req, res) => {
  const id = Number(req.params.id);
  const article = articles.find(item => item.id === id);

  if (!article) {
    return res.status(404).json({
      message: 'Article not found'
    });
  }

  const { title, content } = req.body;

  article.title = title || article.title;
  article.content = content || article.content;
  article.updatedBy = req.user.googleId;

  res.json({
    message: 'Update article successfully',
    user: req.user,
    data: article
  });
});

// DELETE: cần JWT token
router.delete('/article/:id', verifyJwtToken, (req, res) => {
  const id = Number(req.params.id);
  const articleIndex = articles.findIndex(item => item.id === id);

  if (articleIndex === -1) {
    return res.status(404).json({
      message: 'Article not found'
    });
  }

  const deletedArticle = articles.splice(articleIndex, 1);

  res.json({
    message: 'Delete article successfully',
    user: req.user,
    data: deletedArticle[0]
  });
});

module.exports = router;
