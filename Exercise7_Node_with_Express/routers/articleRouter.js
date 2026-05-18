const express = require('express');
const router = express.Router();

let articles = require('../articles');

// GET /articles
router.get('/', (req, res) => {
    res.json(articles);
});

// GET /articles/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
});

// POST /articles
router.post('/', (req, res) => {
    const newArticle = {
        id: articles.length + 1,
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
    };

    articles.push(newArticle);
    res.status(201).json(newArticle);
});

// PUT /articles/:id
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Article not found' });
    }

    articles[index] = {
        ...articles[index],
        ...req.body
    };

    res.json(articles[index]);
});

// DELETE /articles/:id
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Article not found' });
    }

    const deletedArticle = articles.splice(index, 1);
    res.json(deletedArticle[0]);
});

module.exports = router;