var express = require('express');
var router = express.Router();
var request = require('request');
var jwt = require('jwt-simple');
var meli = require('mercadolibre');
var util = require('util');
var config = require('./oauth.js');
var oauth = require('./services');

router.get('/', function(req, res, next) {
    var path = oauth.getPath(req);
    console.log(path);
    res.send('api worked v1.0.1');

});

router.get('/auth/mercadolibre', function (req, res) {
    var authCallback = oauth.getPath(req) + '/api/auth/mercadolibre/callback';
    var redirectUrl = util.format('https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=%s&redirect_uri=%s',
    config.app_id, authCallback);
    res.redirect(redirectUrl);
});

router.get('/auth/mercadolibre/callback', function (req,res) {
    var code = req.query.code;
    let authCallback = oauth.getPath(req) + '/api/auth/mercadolibre/callback';
    var accessTokenUrl = util.format('https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&redirect_uri=%s',
    config.app_id, config.SecretToken, code, authCallback);
    request.post(accessTokenUrl, function(error, response, body) {
        var body = JSON.parse(body);
        profile = {
            id: body.user_id,
            company_id: null,
            services: null,
            accessToken: body.access_token
        };
        msg = {
            token: oauth.createToken(profile),
            message: "Bienvenido a MercadoLibre!"
        };
        req.app.set('token', msg.token);
        //res.send(msg);
        res.redirect(oauth.getPath(req) + '/items');
    });
});

router.get('/user', function(req, res, next) {
    let token = req.app.get('token');
    var payload = jwt.decode(token, config.SecretToken);
    var meliObject = new meli.Meli('', '', token);
    meliObject.get('/users/me?access_token=' + payload.sub.accessToken, function (err, resp) {
        //console.log(err, resp);
        if(!resp){
            res.json({"error" : "No se pudo obtener la informacion del usuario."});
            return;
        }
        let info = resp;
        res.json({user:info});
    });
});

router.get('/categories', function(req, res, next) {
    let token = req.app.get('token');
    var payload = jwt.decode(token, config.SecretToken);
    var meliObject = new meli.Meli('', '', token);
    meliObject.get('sites/MLA/categories', function (err, resp) {
        //console.log(err, resp);
        if(!resp){
            res.json({"error" : "No se pudo obtener el listado de categorias."});
            return;
        }
        let categories = resp;
        res.json({categories:categories});
    });
});

router.get('/categories/:id', function(req, res, next) {
    let token = req.app.get('token');
    var payload = jwt.decode(token, config.SecretToken);
    var id = req.params.id;
    var meliObject = new meli.Meli('', '', token);
    meliObject.get('categories/' + id, function (err, resp) {
        if(!resp){
            res.json({"error" : "No se pudo obtener la informacion de la categoria."});
            return;
        }
        //console.log(err, resp);
        let category = resp;
        res.json({category:category});
    });
});

router.get('/items', function(req, res, next) {
    let token = req.app.get('token');
    let query = req.query.search;
    //console.log(query);
    var payload = jwt.decode(token, config.SecretToken);
    let items = [];
    let author = {"firstname":"Damian","lastname":"Soria"};
    function getDescription(itemProd, count, filters) {
        request('https://api.mercadolibre.com/items/' + itemProd.id +'/description', function(err, resp, body) {
            if (!err && resp.statusCode == 200) {
                //console.log(itemProd);
                let text = JSON.parse(body);
                    text = text.plain_text.replace(/[^a-zA-Z 0-9.]+/g,' ');
                item = {
                    "id": itemProd.id,
                    "title": itemProd.title,
                    "price": {
                        "currency": itemProd.currency_id,
                        "amount": itemProd.price,
                        "decimal":"00"    
                    },
                    "permalink": itemProd.permalink,
                    "pictures": [
                        {
                            "source": itemProd.thumbnail
                        }
                    ],
                    "condition": itemProd.condition,
                    "free_shipping": itemProd.shipping.free_shipping,
                    "description": text,
                    "state": itemProd.seller_address.state.name
                };
                
                    //item.description = text;
                    items.push(item);
                    
                    //console.log(count);
                if (count == 3) {
                    let products = {
                        "author": author,
                        "categories":filters,
                        "items":items
                    };
                    //res.setHeader('content-type', 'application/json');
                    res.json({search:products});
                }
                
            }
        });

    }
    if(!req.query.search){
        var meliObject = new meli.Meli('', '', token);
        meliObject.get('/users/' + payload.sub.id + '/items/search?access_token='+payload.sub.accessToken, function (err, resp) {
            //console.log(err, resp);
            if(!resp.results){
                res.json({"error" : "No se pudo obtener el listado de productos."});
                return;
            }
    
            request('https://api.mercadolibre.com/items?ids=' + resp.results.toString(), function (error, response, body) {
                if (!error && response.statusCode == 200) {                    
                    let data = JSON.parse(body);
                    let filters = data.filters;
                    let count = 0;
                    for(var i = 0; i < data.length; i++) {
                        prod = data[i];
                        var permalink_ssl = prod.permalink.replace('http','https');
                        //console.log('results:'+prod.title);
                        getDescription(prod, count, filters);
                        count++;
                    }
                }
            });
        });
    } else {
        request('https://api.mercadolibre.com/sites/MLA/search?q=' + query.toString(), function (error, response, body) {
            //console.log(error, response);
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(body);
                let filters = data.filters;
                let count = 0;
                for(var i = 0; i < data.results.length; i++) {
                    prod = data.results[i];
                    //console.log('results:'+prod.title);
                    var permalink_ssl = prod.permalink.replace('http','https');
                        //console.log('results:'+prod.title);
                        getDescription(prod, count, filters);
                        count++;
                }
            }
        });
    }

});

router.get('/items/:id', function(req, res, next) {
    let token = req.app.get('token');
    let id = req.params.id;
    //console.log(id);
    var payload = jwt.decode(token, config.SecretToken);
    var meliObject = new meli.Meli('', '', token);
    if(id){
        request('https://api.mercadolibre.com/items/' + id, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let prod = JSON.parse(body);
                
                let author = {"firstname":"Damian","lastname":"Soria"};
                let items = {
                    "id": prod.id,
                    "title": prod.title,
                    "category":prod.category_id,
                    "price": {
                        "currency": prod.currency_id,
                        "amount": prod.price,
                        "decimal":"00"    
                    },
                    "permalink": prod.permalink,
                    "pictures": [
                        {
                            "source": prod.pictures[0].secure_url
                        }
                    ],
                    "condition": prod.condition,
                    "free_shipping":prod.shipping.free_shipping,
                    "sold_quantity":prod.sold_quantity
                };
                request('https://api.mercadolibre.com/items/' + id +'/description', function(err, resp, body) {
                    if (!err && resp.statusCode == 200) {
                        let text = JSON.parse(body);
                        items.description = text.plain_text.replace(/[^a-zA-Z 0-9.]+/g,' ');
                        
                        let products = {
                            "author": author,
                            "items":items
                        };
                        res.json({products:products});
                    }
                });
            }
        });
    } else {
        res.json({"error" : "No se pudo obtener el detalle del producto."});
    }
});

router.get('/items/:id/description', function(req, res, next) {
    let token = req.app.get('token');
    let id = req.params.id;
    //console.log(id);
    var payload = jwt.decode(token, config.SecretToken);
    var meliObject = new meli.Meli('', '', token);
    if(id){
        meliObject.get('/items/' + id + '/description', function (err, resp) {
            if(!resp){
                res.json({"error" : "No se pudo obtener el listado de productos."});
                return;
            }
                request('https://api.mercadolibre.com/items/' + id +'/description', function(err, resp, body) {
                    if (!err && resp.statusCode == 200) {
                        let text = JSON.parse(body);
                            text = text.plain_text.replace(/[^a-zA-Z 0-9.]+/g,' ');
                        
                        res.json({description:text});
                    }
                });
        });
    } else {
        res.json({"error" : "No se pudo obtener el detalle del producto."});
    }
});
module.exports = router; 