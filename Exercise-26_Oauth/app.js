require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Session dùng để Passport lưu trạng thái đăng nhập
app.use(session({
  secret: process.env.SESSION_SECRET || 'sdn302-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Lưu user vào session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Lấy user từ session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Cấu hình Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || 'dummy_client_id',
  clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy_client_secret',
  callbackURL: `https://localhost:${PORT}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'photos'],
  enableProof: true
}, (accessToken, refreshToken, profile, done) => {
  // Lab đơn giản: chưa lưu DB, chỉ lấy thông tin user từ Facebook
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    emails: profile.emails,
    photos: profile.photos
  };

  return done(null, user);
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/facebook');
}

app.get('/', (req, res) => {
  res.send(`
    <h1>SDN302 - Facebook OAuth Login</h1>
    <a href="/auth/facebook">Login with Facebook</a>
  `);
});

// Route bắt đầu login Facebook
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile']
  })
);

// Route callback sau khi Facebook xác thực xong
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login-failed'
  }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', isLoggedIn, (req, res) => {
  res.send(`
    <h1>Login successful</h1>
    <p><b>ID:</b> ${req.user.id}</p>
    <p><b>Name:</b> ${req.user.displayName}</p>
    <p><b>Email:</b> ${req.user.emails?.[0]?.value || 'No email returned'}</p>
    <a href="/logout">Logout</a>
  `);
});

app.get('/login-failed', (req, res) => {
  res.status(401).send('Login failed');
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

// Đọc SSL certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt'))
};

// Chạy HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running at https://localhost:${PORT}`);
});
