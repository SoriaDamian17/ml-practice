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
    request('https://api.mercadolibre.com/sites/MLA/categories', function (error, response, body) {
        if (!error && response.statusCode == 200) {                    
            let data = JSON.parse(body);
            res.json({categories:data});
        }
    });
});

router.get('/items', function(req, res, next) {
    let query = req.query.search;
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

    request('https://api.mercadolibre.com/sites/MLA/search?q=' + query.toString(), function (error, response, body) {
        //console.log(error, response);
        if (!error && response.statusCode == 200) {
            let data = JSON.parse(body);
            let item = {};
            let filters = data.filters;
            let count = 0;
            
            for(var i = 0; i < data.results.length; i++) {
                prod = data.results[i];
                //console.log('results:'+prod.title);
                getDescription(prod, count, filters);
                count++;

            }

        }
    });

});

router.get('/items/:id', function(req, res, next) {
    let id = req.params.id;
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
    if(id){
        request('https://api.mercadolibre.com/items/' + id +'/description', function(err, resp, body) {
            if (!err && resp.statusCode == 200) {
                let text = JSON.parse(body);
                    text = text.plain_text.replace(/[^a-zA-Z 0-9.]+/g,' ');
                
                res.json({description:text});
            }
        });
    } else {
        res.json({"error" : "No se pudo obtener el detalle del producto."});
    }
});
module.exports = router; 