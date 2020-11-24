/* IMPORT SOME USEFUL NODE LIBRARIES INTO THE PROJECT */ 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// const { PeerServer } = require('peer');
// const peerServer = PeerServer({ port: 9000, path: '/peerServer' });

var app = express();
var httpRedir = express();

/* IMPORT MODULES FROM OUR ROUTES DIRECTORY */ 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// import body-parser in order to parse body from POST
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/* VIEW ENGINE SETUP */ 
// specify the folder where the templates will be stored
app.set('views', path.join(__dirname, 'views'));
// specify the template library
app.set('view engine', 'ejs');

/* ADD THE MIDDLEWARE LIBRARIES INTO THE REQUEST HANDLING CHAIN */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  // outputStyle: 'compressed',
  // debug: true, // debug mode
  sourceMap: true
}));

// use the express.static middleware to get Express
// to serve all the static files in the /public
app.use(express.static(path.join(__dirname, 'public')));

// route-handling
app.use('/', indexRouter);
app.use('/users', usersRouter);

/* ADDS HANDLER METHODS FOR ERRORS AND HTTP 404 RESPONSES */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// http redirection(to https)
httpRedir.get("*", function (req, res, next) {
    res.redirect("https://" + req.get('host') + req.originalUrl);
});

/* APP IS NOW CONFIGURED. ALLOWS IT TO BE IMPORTED BY /bin/www */
module.exports = {
  https: app,
  http: httpRedir
};
