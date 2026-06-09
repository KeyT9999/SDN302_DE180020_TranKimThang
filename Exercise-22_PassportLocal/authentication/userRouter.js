const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /users/signup
 * Body:
 * {
 *   "username": "hoai",
 *   "password": "123456",
 *   "fullname": "Hoai Nguyen"
 * }
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const newUser = new User({
      username,
      fullname
    });

    const registeredUser = await User.register(newUser, password);

    passport.authenticate('local')(req, res, () => {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          _id: registeredUser._id,
          username: registeredUser.username,
          fullname: registeredUser.fullname,
          admin: registeredUser.admin
        }
      });
    });
  } catch (err) {
    if (err.name === 'UserExistsError') {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    next(err);
  }
});

/**
 * POST /users/login
 * Body:
 * {
 *   "username": "hoai",
 *   "password": "123456"
 * }
 */
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      _id: req.user._id,
      username: req.user.username,
      fullname: req.user.fullname,
      admin: req.user.admin
    }
  });
});

/**
 * GET /users/logout
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.clearCookie('session-id');

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    });
  });
});

/**
 * GET /users/me
 * Kiểm tra user hiện tại
 */
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Not logged in'
    });
  }

  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      username: req.user.username,
      fullname: req.user.fullname,
      admin: req.user.admin
    }
  });
});

module.exports = router;
