var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const { connectToMongoDB } = require('./config/mongo.connection');

var indexRouter = require('./routes/index');
var productRouter = require('./routes/product.routes');
var categoryRouter = require('./routes/category.routes');
var reviewRouter = require('./routes/review.routes');
var panierRouter = require('./routes/panier.routes');
require('dotenv').config();

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
var usersRouter = require('./routes/users.routes');
app.use('/users', usersRouter);
app.use('/Product', productRouter);
app.use('/Category', categoryRouter);
app.use('/Review', reviewRouter);
app.use('/Panier', panierRouter);

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
  res.json({ error: err.message });
});
const server = http.createServer(app);
server.listen(process.env.Port || 5000, () => {
  connectToMongoDB();
  console.log(`server is running on port ${process.env.Port || 5000}`);
});

