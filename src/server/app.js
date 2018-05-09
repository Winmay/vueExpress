require('../../build/check-versions')()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var logger = require('morgan');

var config = require('../../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)

var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
	? require('../../build/webpack.prod.conf')
	: require('../../build/webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup 模板文件，根据具体情况添加
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*var compiler = webpack(webpackConfig)
//webpack 中间件
// 正式环境时，下面两个模块不需要引入
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})*/

//nodejs 解除跨域限制
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

//为 Express 设置代理
/*app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1') return true; // 受信的 IP 地址
  else return false;
})
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
// 引入history模块
// 引入history模式让浏览器进行前端路由页面跳转
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)*/

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

/*var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})*/

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

/*app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})*/

module.exports = app;
