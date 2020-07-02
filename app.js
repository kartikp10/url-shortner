const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const db = require('./db');

const app = express();
const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);

app.use((err, req, res, next) => {
  console.log('here');
  const status = err.status ? err.status : 500;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// GET Error path.
// app.get('/not-found', (req, res) => {
//   res.status(404).sendFile(__dirname + '/public/not-found.html');
// });

module.exports = app;
