const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')

newsRouter.get('/', async (req, res) => {
    try {
        const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts/`);
        res.render('news', { articles: newsAPI.data });
    } catch (err) {
        res.render('news', { articles: null });
        //handleAxiosError(err);
    }
});

newsRouter.get('/:id', async (req, res) => {
    let articleID = req.params.id;

    try {
        const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts/${articleID}`);
        res.render('newsSingle', { article: newsAPI.data });
    } catch (err) {
        res.render('newsSingle', { article: null });
        handleAxiosError(err);
    }
});

newsRouter.post('/', async (req, res) => {
    let search = req.body.search;
    try {
        const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts?search=${search}`);
        res.render('newsSearch', { articles: newsAPI.data });
    } catch (err) {
        res.render('newsSearch', { articles: null });
        handleAxiosError(err);
    }
});

function handleAxiosError(err) {
    if (err.response) {
        console.error('Response error:', err.response.data, err.response.status);
    } else if (err.request) {
        console.error('Request error:', err.request);
    } else {
        console.error('Error:', err.message);
    }
}

module.exports = newsRouter;
