const express = require('express');
const videoRouter = express.Router();

const videos = [
  {
    id: 1,
    title: 'NodeJS Tutorial',
    url: 'https://youtube.com/example',
    duration: '10:00'
  }
];

videoRouter.get('/', (req, res) => {
  res.status(200).json(videos);
});

videoRouter.post('/', (req, res, next) => {
  try {
    const { title, url, duration } = req.body;

    if (!title || !url || !duration) {
      const err = new Error('Video title, url and duration are required');
      err.status = 400;
      return next(err);
    }

    const newVideo = {
      id: videos.length + 1,
      title,
      url,
      duration
    };

    videos.push(newVideo);

    res.status(201).json({
      message: 'Video created successfully',
      data: newVideo
    });
  } catch (err) {
    next(err);
  }
});

videoRouter.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const video = videos.find(item => item.id === id);

    if (!video) {
      const err = new Error('Video not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
});

module.exports = videoRouter;
