const Article = require('../models/article');

exports.findAll = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, author, content, tags } = req.body || {};
    const article = await Article.create({ title, author, content, tags });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.params.id) {
      const article = await Article.findByIdAndDelete(req.params.id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      return res.status(200).json({ message: 'Article deleted successfully', data: article });
    } else {
      const result = await Article.deleteMany({});
      return res.status(200).json({ message: 'All articles deleted successfully', count: result.deletedCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
