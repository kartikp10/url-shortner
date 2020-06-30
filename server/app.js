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
const shortnerRouter = require('./routes/shortner');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/url', shortnerRouter);

app.use((err, req, res, next) => {
  err.status ? res.status(err.status) : res.status(500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

module.exports = app;
