'use strict';

var config = require('../config/config');
var Promise = require('bluebird');

var databaseType = config.databaseType;

var mysql;
var mssql;
var pool;

if(databaseType === 'mysql'){
	mysql = require('mysql');
	pool  = mysql.createPool({
		host     : config.dbConfig.server,
		user     : config.dbConfig.user,
		password : config.dbConfig.password,
		database : config.dbConfig.database
	});
} else {
	mssql = require('mssql');
}

var ConnectionManager = function ConnectionManager(){};

ConnectionManager.prototype.getConnection = function getConnection(){
	var self = this;
	return new Promise(function(resolve, reject){
		if(databaseType === "mysql"){
			pool.getConnection(function(err, connection){
				if(err){
					logger.error({
						err : err
					}, "error attempting to get connection from MySQL pool.");
					reject(err);
				} else {
					resolve(connection);
				}
			});
		} else {
			mssql.connect(config.dbConfig)
				.then(function(something){
					resolve(something);
				})
				.catch(function(err){
					logger.error({	
						err : err
					}, "error attempting to get MSSQL connection.");
					reject(err);
				});
		}
	});
};

ConnectionManager.prototype.executeQuery = function executeQuery(query, connection){
	var self = this;
	return new Promise(function(resolve, reject){
		if(databaseType === "mysql"){
			connection.query(query, function(err, rows){
				connection.release();
				if(err){
					logger.error({
						err : err,
						query : query
					}, "error attempting to execute MySQL query.")
					reject(err);
				} else {
					resolve(rows);
				}
			});
		} else {
			var request = new mssql.Request(connection)
				.query(query)
				.then(function(rows){
					resolve(rows);
				})
				.catch(function(err){
					logger.error({
						err : err,
						query : query
					}, "error attempting to execute MSSQL query.");
					reject(err);
				});
		}
	});
};

module.exports = new ConnectionManager();
