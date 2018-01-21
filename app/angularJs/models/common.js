var url = require('url');

var staticRouteFor = function (path) {
  var base = process.env.EXPRESS_BASE_PATH || '/';

  return url.resolve(base, path)
};

module.exports = {
  staticRouteFor: staticRouteFor
};