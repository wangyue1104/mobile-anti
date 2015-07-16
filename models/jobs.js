/**
 * Created by Yorkart on 15/7/4.
 */
var schedule = require('node-schedule');
var db = require('../models/db');
var tecentApi = require('./tecentApi');

var rule = new schedule.RecurrenceRule();

var times = [];
for(var i =0 ; i< 60; i=i+5 ){
	times.push(i);
}

rule.second = times;

var job = schedule.scheduleJob(rule, function(){
	db.findOne('SuspiciousPhone', {}, function (data) {
		if (!data || !data.phone) {
			return;
		}
		//TODO 远程验证
		tecentApi(data.phone, data.ip, function (result) {
			if (result.errorCode == 0 && result.level >= 7) {
				// 插入高危库
				var hrDate = {
					phone: data.phone,
					level: result.level,
					timestamp: new Date()
				};
				db.update('HighRiskPhone', {
					phone: hrDate.phone
				}, hrDate);
				// 样本库中删除
				db.remove('SuspiciousPhone', {phone: hrDate.phone});
			}
		}, function (err) {
			console.error(err);
		});
		console.log('schedule');
	});
});

module.exports = job;