var express = require('express');
var router = express.Router();
var common = require('../models/common');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bienvenido a Ml-practice', common:common });
});

router.get('/items', function(req, res, next) {
  var search = req.query.search;
  if(!search) {
    res.render('listProduct', { title: 'Productos Mercadolibre', common:common });
  } else {
    res.render('search', { title: 'Productos Buscados', common:common });  
  }
});

/* GET home page. */
router.get('/items/:id', function(req, res, next) {
  let product = 
  res.render('product', { title: 'Auricular Bluetooth 3.0', common:common });
});

module.exports = router;
