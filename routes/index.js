const express = require('express');
const router = express.Router();
let yup = require('yup');
const { json } = require('express');
const { nanoid } = require('nanoid');
const app = require('../app');
const { urls, db } = require('../db');
const nodemon = require('nodemon');

const baseUri =
  process.env.NODE_ENV === 'production' ? 'trimr.cc/' : 'localhost:3000/';

let schema = yup.object({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-]/i)
    .max(20),
  url: yup.string().trim().url().required(),
});

// GET url with alias or id and resirect client.
router.get('/:alias', async (req, res, next) => {
  const alias = req.params.alias;
  // const url = urls.find((u) => u.id === parseInt(id));
  try {
    const url = await urls.findOne({ alias: alias });
    if (url) {
      return res.redirect(url.url);
      // return res.json({ trimmedUrl: process.env.BASE_URI + alias });
    } else {
      return res.status(404).redirect('/?error=not-found');
    }
  } catch (err) {
    console.error(err);
    return res.status(404).redirect('/?error=not-found');
  }
});

// POST Create a new short url
router.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    if (!alias) {
      alias = nanoid(5).toLocaleLowerCase();
    }
    await schema.validate({ alias, url });
    const newUrl = {
      alias,
      url,
    };
    const created = await urls.insert(newUrl);
    if (created) {
      res.json({ trimmedUrl: baseUri + alias });
    }
  } catch (err) {
    if (err.message.startsWith('E11000')) {
      res.json({ error: 'Alias in use 💩' });
    } else {
      next(err);
    }
  }
});

module.exports = router;
