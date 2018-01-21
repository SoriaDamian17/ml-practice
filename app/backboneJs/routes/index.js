var express = require('express');
var router = express.Router();
var common = require('../models/common');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Productos Mercadolibre', common:common });
});

router.get('/items', function(req, res, next) {
  var search = req.query.search;
  if(!search) {
    res.render('index', { title: 'Productos Mercadolibre', common:common });
  } else {
    res.render('search', { title: 'Productos Buscados', common:common });  
  }
});

/* GET home page. */
router.get('/items/:id', function(req, res, next) {
  res.render('product', { title: 'Auricular Bluetooth 3.0', common:common });
});

/* GET home page. */
router.get('/404', function(req, res, next) {
  res.render('error', { title: '404 Not found', common:common });
});

module.exports = router;
