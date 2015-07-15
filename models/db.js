/**
 * Created by Yorkart on 15/7/4.
 */
var config = require('../config');
var mongodb = require('mongodb');
var server = new mongodb.Server(config.mongo.server, config.mongo.port, {auto_reconnect: true});
var db = new mongodb.Db(config.mongo.db, server, {safe: true});


module.exports = {
	findOne : function(collection, selector, callback){
		db.open(function (err, db) {
			db.collection(collection, function (err, collection) {
				collection.findOne(selector,function (err, data) {
					callback(data ? data : null);
				});

			});
		});
	},
	update: function(collection, selector,document){
		db.open(function (err, db) {
			db.collection(collection, function (err, collection) {
				collection.update(selector,{$set: document}, {upsert: true},function (err, data) {
					if (data) {
						console.log('Successfully Insert');
					} else {
						console.log('Failed to Insert');
					}
				});

			});
		});
	},
	remove : function(collection, selector){
		db.open(function (err, db) {
			db.collection(collection, function (err, collection) {
				collection.remove(selector, {safe:true}, function (err, data) {
					if (data) {
						console.log('Successfully Insert');
					} else {
						console.log('Failed to Insert');
					}
				});

			});
		});
	}
};