const express = require('express');

const articleRouter = require('./routers/articleRouter');
const videoRouter = require('./routers/videoRouter');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.get('/', (req, res) => {
    res.send('Node Express P2 is running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});