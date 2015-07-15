var express = require('express');
var router = express.Router();
var db = require('../models/db');
var tencentApi = require('../models/tencentApi');


/* GET users listing. */
router.get('/validator', function (req, res, next) {
	var phone = req.query.phone;
	var ip = req.query.ip;
	if(phone) {
		var data = {
			phone: phone,
			ip: ip, //getClientIp(req),
			timestamp: new Date()
		};
		db.update('SuspiciousPhone',{
			phone: data.phone,
			ip: data.ip
		},data);
	}
	res.send('ok');
});

router.get('/validator/realtime', function (req, res, next) {
	var phone = req.query.phone;
	var ip = req.query.ip;
	if(phone && ip) {
		var data = {
			phone: phone,
			ip: ip, //getClientIp(req),
			timestamp: new Date()
		};
		db.findOne('HighRiskPhone',{
			phone: data.phone
		},function(data){
			if(data){
				res.send('true');
			}else {
				// TODO 远程验证
				tencentApi(phone, ip, function (result) {
					if(result.errorCode == 0) {
						if(result.level < 7) {
							res.send("true");
						}else {
							res.send("false");
							// 插入高危库
							var hrDate = {
								phone: phone,
								level: result.leve,
								timestamp: new Date()
							};
							db.update('HighRiskPhone',{
								phone: hrDate.phone
							},hrDate);
						}
					}else {
						res.send("error");
					}
				}, function (err) {
					res.send("error");
				});
			}
		});

	}
	//res.send('ok');
});



router.get('/validator/offline', function (req, res, next) {
	var phone = req.query.phone;
	if(phone) {
		db.findOne('HighRiskPhone',{
			phone: data.phone
		},function(data){
			res.send(data ? 'true' : 'false');
		});
	}
	res.send('ok');
});



function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
}


module.exports = router;
