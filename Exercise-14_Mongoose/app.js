const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const User = require('./models/user');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/my_database')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Tự tạo collection trong MongoDB dựa trên Schema ngay khi khởi chạy
    await User.createCollection();
    await Article.createCollection();
    console.log('Collections "users" and "articles" created/synced successfully');

    // Tự động tạo user mẫu nếu chưa có
    let adminUser = await User.findOne({ username: 'admin' });
    let authorUser = await User.findOne({ username: 'author_john' });

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        password: 'adminpassword123'
      });
      console.log('Seeded sample user: admin');
    }

    if (!authorUser) {
      authorUser = await User.create({
        username: 'author_john',
        password: 'johnpassword123'
      });
      console.log('Seeded sample user: author_john');
    }

    // Tự động thêm dữ liệu mẫu nếu chưa có bài viết nào
    const count = await Article.countDocuments();
    if (count === 0) {
      console.log('No articles found. Seeding initial data...');
      await Article.create([
        {
          title: 'Introduction to Mongoose',
          slug: 'intro-to-mongoose',
          published: true,
          author: 'Nguyen Van A',
          user: adminUser._id,
          content: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.',
          tags: ['mongoose', 'mongodb', 'nodejs'],
          category: 'Database'
        },
        {
          title: 'Getting Started with Express',
          slug: 'getting-started-express',
          published: true,
          author: 'Tran Thi B',
          user: authorUser._id,
          content: 'Express is a minimal and flexible Node.js web application framework.',
          tags: ['express', 'nodejs', 'backend'],
          category: 'Web Development'
        },
        {
          title: 'Advanced MongoDB Validation',
          slug: 'advanced-mongodb-validation',
          published: false,
          author: 'Nguyen Van A',
          user: adminUser._id,
          content: 'This draft discusses validation schemas and complex rules in Mongoose.',
          tags: ['mongoose', 'mongodb', 'validation'],
          category: 'Database'
        }
      ]);
      console.log('Initial sample articles seeded successfully!');
    } else {
      console.log(`Database already has ${count} articles. Skipping seeding.`);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Exercise 14: Mongoose is running with User integration');
});

// --- API endpoints for Users ---

// Đăng ký user mới
app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(201).json({
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Lấy danh sách users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
});

// --- API endpoints for Articles ---

// Tạo bài viết mới (truyền userId để liên kết)
app.post('/api/articles', async (req, res) => {
  try {
    const { title, slug, published, author, content, tags, category, userId } = req.body;
    const article = await Article.create({
      title,
      slug,
      published,
      author,
      content,
      tags,
      category,
      user: userId
    });

    const populated = await Article.findById(article._id).populate('user');
    res.status(201).json({
      message: 'Article created successfully',
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create article',
      error: error.message
    });
  }
});

// Lấy danh sách tất cả bài viết, populate thông tin user đăng bài
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().populate('user');
    res.json(articles);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve articles',
      error: error.message
    });
  }
});

// Lấy thông tin 1 bài viết theo ID, populate thông tin user
app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('user');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve article',
      error: error.message
    });
  }
});

// --- Existing Original Test Routes Updated for the new schema requirements ---

app.get('/test-error', async (req, res) => {
  try {
    // Sẽ lỗi vì thiếu nhiều trường bắt buộc bao gồm cả 'user' reference
    const article = await Article.create({
      title: 'Hi',
      published: true,
      content: 'This article will fail validation'
    });

    res.json(article);
  } catch (error) {
    res.status(400).json({
      message: 'Validation error',
      error: error.message
    });
  }
});

app.get('/test-success', async (req, res) => {
  try {
    // Tìm hoặc tạo admin user để liên kết
    let user = await User.findOne({ username: 'admin' });
    if (!user) {
      user = await User.create({ username: 'admin', password: 'adminpassword123' });
    }

    const article = await Article.create({
      title: 'Awesome Post',
      slug: 'awesome-post',
      published: true,
      author: 'Nguyen Van A',
      user: user._id,
      content: 'This is the best post ever',
      tags: ['mongoose', 'nodejs', 'express'],
      category: 'Node.js'
    });

    const populated = await Article.findById(article._id).populate('user');

    res.json({
      message: 'Article saved successfully',
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      message: 'Insert failed',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
