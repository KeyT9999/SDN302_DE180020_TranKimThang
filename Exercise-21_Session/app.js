const express = require('express');
const mongoose = require('mongoose');
const configSession = require('./config/sessionConfig');
const articleRouter = require('./routes/articleRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/node_session')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

configSession(app);

// Simple logging middleware to see sessions in action
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Session ID:', req.sessionID);
  console.log('Session User:', req.session ? req.session.user : 'none');
  next();
});

app.use('/api/articles', articleRouter);

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === 'admin' && password === '123') {
    req.session.user = {
      username: username
    };

    return res.json({
      message: 'Login successfully',
      user: req.session.user
    });
  }

  res.status(401).json({
    message: 'Invalid username or password'
  });
});

app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({
          message: 'Logout failed'
        });
      }

      res.clearCookie('connect.sid');

      res.json({
        message: 'Logout successfully'
      });
    });
  } else {
    res.json({
      message: 'Logout successfully (no session)'
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
