var express = require('express');
var router = express.Router();

/* Redirect home page to /books route */
router.get('/', ( req, res ) => {
  res.redirect('/books');
});

module.exports = router;
