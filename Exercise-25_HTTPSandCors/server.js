const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const passport = require('./authentication/passport');
require('dotenv').config();

const connectDB = require('./connect/database');

const userRouter = require('./authentication/userRouter');
const articleRouter = require('./routes/articleRouter');

const app = express();
const port = process.env.PORT || 3443;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'HTTPS CORS API is running'
  });
});

const options = {
  key: fs.readFileSync(path.join(__dirname, 'bin', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'bin', 'cert.pem'))
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS Server is running on https://localhost:${port}`);
});
