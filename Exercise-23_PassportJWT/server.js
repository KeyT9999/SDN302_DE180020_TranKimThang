const express = require('express');
const passport = require('./authentication/passport');
require('dotenv').config();

const connectDB = require('./connect/database');

const userRouter = require('./authentication/userRouter');
const articleRouter = require('./routes/articleRouter');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/users', userRouter);
app.use('/articles', articleRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Passport JWT API is running'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
