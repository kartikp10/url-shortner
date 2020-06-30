var express = require('express');
var router = express.Router();

/* GET url to be shortned. */
router.get('/url', function (req, res) {
  res.send({ res: 'respond with a resource' });
});

module.exports = router;
