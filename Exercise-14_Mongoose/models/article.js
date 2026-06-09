const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    lowercase: true
  },
  published: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  content: String,
  tags: [String],
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: Date
});

module.exports = mongoose.model('Article', articleSchema);
