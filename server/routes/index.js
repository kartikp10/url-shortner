const express = require('express');
const router = express.Router();
let yup = require('yup');
const { json } = require('express');
const { nanoid } = require('nanoid');
const app = require('../app');
const { urls, db } = require('../db');
const nodemon = require('nodemon');

let schema = yup.object({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-]/i)
    .max(20),
  url: yup.string().trim().url().required(),
});

// GET url with alias or id
router.get('/url/:alias', async (req, res, next) => {
  const alias = req.params.alias;
  // const url = urls.find((u) => u.id === parseInt(id));
  const url = await urls.findOne({ alias: alias });
  if (url) {
    return res.json({ trimmedUrl: process.env.BASE_URI + alias });
  } else {
    return res.status(404).json({ error: 'trimmed url not found 🥞' });
  }
});

// POST Create a new short url
router.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    if (!alias) {
      console.log(alias);
      alias = nanoid(5).toLocaleLowerCase();
    }
    await schema.validate({ alias, url });
    const newUrl = {
      alias,
      url,
    };
    const created = await urls.insert(newUrl);
    res.json(newUrl);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
