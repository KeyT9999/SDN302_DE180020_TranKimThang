require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const articlesRouter = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware đọc JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session cho Passport Google OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'sdn302_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Cấu hình Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
  callbackURL: `https://localhost:${PORT}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    googleId: profile.id,
    username: profile.displayName,
    email: profile.emails?.[0]?.value || null
  };

  return done(null, user);
}));

app.get('/', (req, res) => {
  res.send(`
    <h1>Google OAuth + JWT + REST API</h1>
    <p>Step 1: Login Google</p>
    <a href="/auth/google">Login with Google</a>
  `);
});

// Bước 1: Redirect sang Google để login
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Bước 2: Google callback về server
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed'
  }),
  (req, res) => {
    const payload = {
      googleId: req.user.googleId,
      username: req.user.username,
      email: req.user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'sdn302_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login Google successfully. Copy this token to Postman.',
      tokenType: 'Bearer',
      token,
      user: payload
    });
  }
);

app.get('/login-failed', (req, res) => {
  res.status(401).json({
    message: 'Login Google failed'
  });
});

// Articles REST API
app.use('/api/articles', articlesRouter);

// HTTPS certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt'))
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running at https://localhost:${PORT}`);
});
