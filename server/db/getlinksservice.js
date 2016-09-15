'use strict';

var mssql = require('mssql');
var promise = require('bluebird');
var queries = require('./queries/queries');
var util = require('util');
var config = require('../config/config');

var GetLinksService = function GetLinksService(){};

var _formatConditionWithValue = function _formatConditionWithValue(condition, value){
	if (typeof value === 'number'){
		value = value.toString();
	}
	return util.format(queries[condition], value)
};

GetLinksService.prototype.getLinks = function getLinks(tableName, options){
	var self = this;
	return self.constructQuery(tableName, options)
		.then(function(query){
			if(query==="default"){
				query = util.format(queries.getTop100, tableName);
			}
			return query;
		})
		.then(function(query){
			return self.executeQuery(query);
		});
};

GetLinksService.prototype.executeQuery = function executeQuery(query){
	return new Promise(function(resolve, reject){
		mssql.connect(config.dbConfig)
			.then(function(){
				var request = new mssql.Request()
					.query(query)
					.then(function(rows){
						resolve(rows);
					})
					.catch(function(err){
						console.log(err);
						reject(err);
					});
			})
			.catch(function(err){
				reject(err);
			});
	});
};

var _validateOptions = function _validateOptions(options){
	var valid = true;
	var validOptions = {
		"ref_domain_topical_trust_flow_value" : "string",
		"source_url" : "string",
		"target_url" : "string"
	};
	for (var k in options){
		if(typeof options[k] !== validOptions[k]){
			return false;
		}
	}
	return valid;
};

GetLinksService.prototype.constructQuery = function constructQuery(tableName, options){
	var self = this;

	var masterQuery = queries.master;
	var conditions = [];
	var subQuery = "";

	return new Promise(function(resolve, reject){
		if(!_validateOptions(options)){
			return reject('invalid data type for option.');
		}
		for(var k in options){
			conditions.push(_formatConditionWithValue(k, options[k]));
		}

		if(conditions.length){
			for(var i = 0; i < conditions.length; i++){
				if(i === conditions.length-1){
					subQuery += conditions[i] + ";";
				} else {
					subQuery += (conditions[i] + " AND ");
				}
			}
			masterQuery = util.format(masterQuery, tableName, subQuery);
			resolve(masterQuery);
		} else {
			resolve('default');
		}
	});
};

module.exports = new GetLinksService();






