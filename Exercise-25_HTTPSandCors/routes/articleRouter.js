const express = require('express');
const Article = require('../models/Article');
const jwtConfig = require('../config/jwtConfig');
const cors = require('./cors');

const router = express.Router();

// Preflight options handling
router.options('/', cors);
router.options('/:id', cors);

/**
 * GET /articles
 * Ai cũng xem được
 */
router.get('/', cors, async (req, res) => {
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
 * Cần JWT token
 */
router.post('/', cors, jwtConfig.verifyUser, async (req, res) => {
  try {
    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      createdBy: req.user.username,
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
 * Cần JWT token
 */
router.put('/:id', cors, jwtConfig.verifyUser, async (req, res) => {
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
      updatedBy: req.user.username,
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
 * Cần JWT token
 */
router.delete('/:id', cors, jwtConfig.verifyUser, async (req, res) => {
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
      message: 'Article deleted successfully',
      deletedBy: req.user.username
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
