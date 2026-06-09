const express = require('express');
const Article = require('../models/Article');
const auth = require('../authentication/auth');

const router = express.Router();

/**
 * GET /articles
 * Ai cũng xem được
 */
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();

    res.status(200).json({
      success: true,
      data: articles
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * POST /articles
 * Chỉ user đã login mới được tạo bài
 */
router.post('/', auth.verifyUser, async (req, res) => {
  try {
    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * PUT /articles/:id
 * Chỉ user đã login mới được update
 */
router.put('/:id', auth.verifyUser, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/**
 * DELETE /articles/:id
 * Chỉ user đã login mới được xóa
 */
router.delete('/:id', auth.verifyUser, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
