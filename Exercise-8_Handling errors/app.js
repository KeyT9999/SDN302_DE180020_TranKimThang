const express = require('express');
const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
