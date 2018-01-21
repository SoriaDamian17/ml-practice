// services.js
var jwt = require('jwt-simple');  
var moment = require('moment');  
var config = require('./oauth.js');

exports.getPath = function(req) {  
  var fullUrl = req.protocol + '://' + req.get('host');

  return fullUrl;
};

exports.createToken = function(profile) {  
    
  var payload = {
    sub: profile,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };

  return jwt.encode(payload, config.SecretToken);
};

exports.ensureAuthenticated = function(token) {  
  /*  return res
      .status(401)
      .send({error: true, message: "El token ha expirado"});
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({error: true, message: "Usuario no identificado"});
  }*/

  var token = token.split(" ")[1];
  var payload = jwt.decode(token, config.SecretToken);

  if(payload.exp <= moment().unix()) {
    return res
      .status(401)
      .send({error: true, message: "El token ha expirado"});
  }

  return payload.sub;
};