const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const Article = require('./models/article');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/my_database')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Seed admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('Seeded admin user');
    }

    // Seed Hoai 123 user
    const hoaiExists = await User.findOne({ username: 'Hoai 123' });
    if (!hoaiExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt);
      await User.create({ username: 'Hoai 123', password: hashedPassword });
      console.log('Seeded Hoai 123 user');
    }

    // Seed sample article from screenshot
    const articlesCount = await Article.countDocuments();
    if (articlesCount === 0) {
      await Article.create({
        title: 'Exploring the Hidden Gems of Paris',
        author: 'Jane Doe',
        content: 'Paris is known for its architecture, history, and romance. But beyond the Eiffel Tower...',
        tags: [],
        date: new Date('2024-03-15T13:05:36.262Z')
      });
      console.log('Seeded sample article');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logger middleware to show cookies in console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Cookies received:', req.cookies);
  next();
});

// Routes
app.use('/', routes);

// 404 Route handler
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
