require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.get('/', (req, res) => {
  res.send('SDN302 MongoDB Atlas connected');
});

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
