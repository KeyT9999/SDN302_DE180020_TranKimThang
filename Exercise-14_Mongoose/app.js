const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/my_database')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Tự tạo collection trong MongoDB dựa trên Schema ngay khi khởi chạy
    await Article.createCollection();
    console.log('Collection "articles" created/synced successfully');

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
          content: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.',
          tags: ['mongoose', 'mongodb', 'nodejs'],
          category: 'Database'
        },
        {
          title: 'Getting Started with Express',
          slug: 'getting-started-express',
          published: true,
          author: 'Tran Thi B',
          content: 'Express is a minimal and flexible Node.js web application framework.',
          tags: ['express', 'nodejs', 'backend'],
          category: 'Web Development'
        },
        {
          title: 'Advanced MongoDB Validation',
          slug: 'advanced-mongodb-validation',
          published: false,
          author: 'Nguyen Van A',
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
  res.send('Exercise 14: Mongoose is running');
});

app.get('/test-error', async (req, res) => {
  try {
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
    const article = await Article.create({
      title: 'Awesome Post',
      slug: 'awesome-post',
      published: true,
      author: 'Nguyen Van A',
      content: 'This is the best post ever',
      tags: ['mongoose', 'nodejs', 'express'],
      category: 'Node.js'
    });

    res.json({
      message: 'Article saved successfully',
      data: article
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
