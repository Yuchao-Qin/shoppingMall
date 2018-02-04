var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//对日志进行输出 

// ==============================
var ejs = require('ejs');
// ===============================


var cookieParser = require('cookie-parser');
// 获取cookie信息进行转  化

var bodyParser = require('body-parser');
// 对post请求的返回值进行转化

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 设置views访问的目录
// ======================================
app.engine('.html',ejs.__express)
// =======================================  
app.set('view engine', 'html');
//  设置引擎


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//转化成json 

app.use(bodyParser.urlencoded({ extended: false }));
// 对URL进行编码

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 设置静态资源的目录
app.use((req,res,next)=>{
  if(req.cookies.userId){
    next();
  }else{
    console.log(req.originalUrl)
    if(req.originalUrl == "/users/login"||req.originalUrl=="/users/logout"||req.path=="/goods/list") {
      // 用  req.path 不用考虑参数 
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      });
    }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
