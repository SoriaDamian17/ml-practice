var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var sassMiddleware = require('node-sass-middleware');
var api = require('./models/product');
var index = require('./routes/index');
//Execute Plataform
var app = express();
//Locals Var
app.locals.token = '';
app.locals.category_name = '';
app.locals.description = '';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
/*app.use(sassMiddleware({
  src: path.join(__dirname, 'public/sass/'),
  dest: path.join(__dirname, 'public/css/'),
  debug: true,
  indentedSyntax : false,
  outputStyle: 'compressed'
}));*/
app.use('/static', express.static(path.join(__dirname, 'public')));
//Router
app.use('/', index);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Ml practice | Search'});
});
//app.listen(process.env.PORT || 3000)
module.exports = app;
