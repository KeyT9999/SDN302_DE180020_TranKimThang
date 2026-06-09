const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

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
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        info
      });
    }

    const token = jwtConfig.getToken({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      admin: user.admin
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token
    });
  })(req, res, next);
});

/**
 * GET /users/me
 * Cần token
 */
router.get('/me', jwtConfig.verifyUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

module.exports = router;
