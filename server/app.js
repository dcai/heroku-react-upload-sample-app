var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var logger = require('morgan');
var nunjucks = require('nunjucks');
var path = require('path');
var webpack = require('webpack');
var favicon = require('serve-favicon');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var testRoute = require('./routes/test');
var indexRoute = require('./routes/index');
var multer = require('multer');
var upload = multer({dest: 'files/'});

var isDev = process.env.NODE_ENV !== 'production';

function dirPath(dest){
  var filepath = __dirname + dest;
  return filepath;
}

function addWebpackMiddlewaresToExpressApp(expressApp) {
  var webpackConfig = require('../webpack.config');
  var compiler = webpack(webpackConfig);

  webpackConfig.entry.index.unshift('react-hot-loader/patch');
  // webpack/hot/dev-server will reload the entire page if the HMR update fails
  // webpack/hot/only-dev-server reload the page manually
  // ...unshift(`webpack-dev-server/client?http://${host}:${port}`);
  webpackConfig.entry.index.unshift('webpack-hot-middleware/client');
  //enable webpack middleware for hot-reloads in development
  var devMiddlewareOptions = {
    publicPath: webpackConfig.output.publicPath,
    noInfo: false,
    quiet: false,
    lazy: false,
    watchOptions: {
      poll: true,
    },
    hot: true,
    stats: {
      colors: true,
      chunks: false,
      'errors-only': true
    }
  };
  expressApp.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  var hotMiddlewareOptions = {
    log: console.log
  };
  expressApp.use(webpackHotMiddleware(compiler, hotMiddlewareOptions));

  return expressApp;
}

function configTemplates(expressApp) {
  var templatesPath = path.join(__dirname, 'templates');
  var nunjucksEnv = nunjucks.configure(templatesPath, {
    noCache: isDev,
    autoescape: true,
    express: expressApp
  });

  nunjucksEnv.addGlobal('isDev', isDev);

  // view engine setup
  expressApp.set('views', templatesPath);
  expressApp.set('view engine', 'html');
  return expressApp;
}


var app = express();
app.use(logger(isDev ? 'dev' : 'common'));
app.use(favicon(path.join(__dirname, '/../public/', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if (isDev) {
  app = addWebpackMiddlewaresToExpressApp(app);
}
app = configTemplates(app);

app.use('/assets', express.static(dirPath('/../public/assets/')));
app.use(testRoute);
app.use(indexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.put('/files', upload.array('files'), function (req, res, next) {
});

// error handling middleware must have 4 arguments
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error', err);
});

module.exports = app;
