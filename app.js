var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var campaign = require('./routes/campaign');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/cropperjs/dist'));
app.use('/stylesheets', express.static(__dirname + '/node_modules/cropper/dist'));
app.use('/javascripts', express.static(__dirname + '/node_modules/jquery-cropper/dist'));

mongoose.connect('mongodb://127.0.0.1/atutudb'); // studydb is anyname can insert
var db = mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));

//session : before routing
    app.use(session({
          secret: 'AN12@~1!/y8&^*@$%<<,',// any string for security
          resave: false,
          saveUninitialized : true
}));
app.use(flash()); // after cookie, session
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.active = req.path;
  console.log('user path', req.path);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/campaign',campaign);

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

module.exports = app;
