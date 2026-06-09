const express = require('express');
const router = express.Router();
const articleRouter = require('./articleRouter');
const commentRouter = require('./commentRouter');
const usersRouter = require('./users');

router.use('/articles', articleRouter);
router.use('/comments', commentRouter);
router.use('/users', usersRouter);

module.exports = router;
