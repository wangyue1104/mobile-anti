/**
 * Created by wangyue1 on 2015/7/8.
 */

var http = require('http');
var crypto = require('crypto');
var config = require('../config');

var api_url = config.qq_save.api_url;
var cs_secretid = config.qq_save.cs_secretid;
var secretKey = config.qq_save.secretKey;
var api_path = config.qq_save.api_path;

module.exports = function(phone, ip, successCallBack, errorCallBack){
	var date = new Date();

	var params =
		'?cs-secretid=' + encodeURIComponent(cs_secretid) +
		'&cs-nonce=' + Math.floor(Math.random() * 100000) +
		'&cs-timestamp=' + encodeURIComponent(Math.floor(date.getTime() / 1000)) +
		'&platform=5' +
		'&mobile=0086-' + phone +
		'&userip=' + ip;

	var cs_sig = crypto.createHmac('sha1', secretKey).update('body=&method=GET&url=' + api_path + params).digest().toString('base64');
	var params = params + '&cs-sig=' + encodeURIComponent(cs_sig);

	var url = api_url + api_path + params;
	console.log(url);
	http.get(url,function(res){
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			successCallBack(JSON.parse(chunk));
		});
	}).on('error', function(err){
		console.error(err);
		errorCallBack(err);
	});

};