const express = require('express');
const app = express();
const port = 3000;
//Import data from articles.js
const articles = require('./articles');

app.use(express.json());

//GET all articles
app.get('/articles', async (req, res) => {
  res.status(200).json({ message: "Article read successfully", data: articles });
});

// Create a new article
app.post('/articles', (req, res) => {
  const newArticle = req.body;
  articles.push(newArticle);
  res.status(201).end('Created a new article successfully!');
});

// Get article by id
app.get('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  const article = articles.find(a => a.id === parseInt(articleId));
  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404).end('Article not found!');
  }
});

// DELETE all articles
app.delete('/articles', async (req, res) => {
  try {
    res.status(200).end('Deleting all articles');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST a specific article
app.post('/articles/:id', async (req, res) => {
  try {
    res.status(403).end('POST operation not supported on /articles/' + req.params.id);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT a specific article
app.put('/articles/:id', async (req, res) => {
  try {
    res.write('Updating the article: ' + req.params.id + '\n');
    res.status(201).end('Will update the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific article
app.delete('/articles/:id', async (req, res) => {
  try {
    res.status(200).end('Deleting article: ' + req.params.id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to Simple Express App!');
});

app.get('/Hello', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
