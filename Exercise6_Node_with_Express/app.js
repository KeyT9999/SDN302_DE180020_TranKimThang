const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const articles = require('./articles');

// GET all articles
app.get('/articles', (req, res) => {
    res.status(200).json(articles);
});

// GET article by id
app.get('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
});

// POST new article
app.post('/articles', (req, res) => {
    const newArticle = {
        id: articles.length + 1,
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
    };

    articles.push(newArticle);
    res.status(201).json(newArticle);
});

// PUT update article
app.put('/articles/:id', (req, res) => {
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

// DELETE article
app.delete('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Article not found' });
    }

    const deletedArticle = articles.splice(index, 1);
    res.json(deletedArticle[0]);
});


let videos = [
    {
        id: 1,
        title: "React Tutorial for Beginners",
        description: "This is the first video",
        url: "https://www.youtube.com/embed/SqcY0GlETPk",
        duration: "5:30",
        image: "https://example.com/video1.jpg"
    }
];

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.get('/videos/:id', (req, res) => {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
});

app.post('/videos', (req, res) => {
    const newVideo = {
        id: videos.length + 1,
        ...req.body
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

app.put('/videos/:id', (req, res) => {
    const index = videos.findIndex(v => v.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Video not found' });

    videos[index] = {
        ...videos[index],
        ...req.body
    };

    res.json(videos[index]);
});

app.delete('/videos/:id', (req, res) => {
    const index = videos.findIndex(v => v.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Video not found' });

    const deletedVideo = videos.splice(index, 1);
    res.json(deletedVideo[0]);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});