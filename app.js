//Import modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'),
  swaggerDocs = require('./swagger.json');
var dotenv = require('dotenv');
const userController = require('./controllers/userController');

//Create server express
var app = express();

//Config for load .env files
dotenv.config();

//Create connection database Mongo whit Mongoose
const connection = require('./services/connectionBD_Mongo');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// General functions server setup
app.use(logger('dev'));
app.use(express.json());
swagger = require('swagger-node-express');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Directory static files
app.use(express.static(path.join(__dirname, 'public')));

//Config i18n
const i18n = require('./services/i18nConfigure');
app.use(i18n.init);

//==================================================================
//Configura Swagger for documentation API
//==================================================================
app.use(
  '/api/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    swaggerOptions: {},
  })
);
swagger.setAppHandler(app);

//==================================================================
//Routes
//==================================================================
// Website routes
app.use('/', require('./routes/index'));
app.use('/change-locale', require('./routes/change-locale'));

// Api routers
app.use('/api/v1/advertisement', require('./routes/api/v1/advertisement'));
app.use('/api/v1/user', require('./routes/api/v1/user'));
app.post('/api/v1/authenticate', userController.authJWT);

//==================================================================
//Errors
//==================================================================
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
const filter_isAPIRequest = require('./services/filter_isAPIRequest');
app.use(function (err, req, res, next) {
  //Filter errors in json for api routers or html website routes
  if (filter_isAPIRequest(req)) {
    res.json({ error: err.message });
    return;
  }

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

//==================================================================
//Export app
//==================================================================
module.exports = app;

//TODO: degub swagger /authenticate and user/authenticate
