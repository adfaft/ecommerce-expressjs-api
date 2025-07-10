var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Hi!',
    message: 'No direct access is allowed.' 
  });
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
  res.status(404).render('error', { 
    message: 'Page not found.' 
  });
});

module.exports = router;
