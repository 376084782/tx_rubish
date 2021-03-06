var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import indexRouter from './routes/index'
import AdminRouter from './routes/admin'
import ModelGroup from './models/ModelGroup';




var app = express();
app.all('*', function (req, res, next) {
	// 设置请求头为允许跨域
	res.header('Access-Control-Allow-Origin', '*');
	// 设置服务器支持的所有头信息字段
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
	// 设置服务器支持的所有跨域请求的方法
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (req.method.toLowerCase() == 'options') {
		res.sendStatus(200); // 让options尝试请求快速结束
	} else {
		next();
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rubish', indexRouter);
app.use('/admin', AdminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


async function initGroupList() {
	let listGroup = await ModelGroup.find({})
	if (listGroup.length == 0) {
		await ModelGroup.insertMany([{
				groupId: "南山",
			},
			{
				groupId: "虹桥"
			},
			{
				groupId: "漕河泾"
			},
			{
				groupId: "望京"
			},
			{
				groupId: "陆家嘴",
			},
			{
				groupId: "西二旗",
			},
			{
				groupId: "西溪",
			},
			{
				groupId: "知春路",
			},
			{
				groupId: "其它",
			}
		])
	}
}
initGroupList()


module.exports = app;