const express = require('express');

const {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle
} = require('./operation');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Exercise 13: Connecting MongoDB with NodeJS');
});

// CREATE
app.get('/create', async (req, res) => {
  try {
    await createArticle();
    res.send('Article inserted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// READ
app.get('/articles', async (req, res) => {
  try {
    await getArticles();
    res.send('Check terminal to see articles');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// UPDATE
app.get('/update/:id', async (req, res) => {
  try {
    await updateArticle(req.params.id);
    res.send('Article updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE
app.get('/delete/:id', async (req, res) => {
  try {
    await deleteArticle(req.params.id);
    res.send('Article deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
