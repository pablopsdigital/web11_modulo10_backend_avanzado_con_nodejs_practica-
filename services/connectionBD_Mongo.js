'use strict';
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connection.on('error', (err) => {
  console.log('Connection error', err);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB to the DB:', mongoose.connection.name);
});

// Create connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/nodepop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true,
});

module.exports = mongoose.connection;
