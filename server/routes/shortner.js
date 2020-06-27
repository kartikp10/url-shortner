var express = require('express');
var router = express.Router();

/* POST url to be shortned. */
router.post('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
