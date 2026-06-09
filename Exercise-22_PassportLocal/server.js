const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const connectDB = require('./connect/database');

// Import auth để chạy cấu hình passport strategy
require('./authentication/auth');

const userRouter = require('./authentication/userRouter');
const articleRouter = require('./routes/articleRouter');

const app = express();
const port = process.env.PORT || 8000;

// Connect database
connectDB();

// Middleware đọc body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  name: 'session-id',
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Passport Local API is running'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
