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
}


//A test function.
GetLinksService.prototype.queryForTop100 = function queryForTop100(tableName){
	var getTop100 = queries.getTop100;
	getTop100 = util.format(getTop100, tableName);
	console.log(getTop100);
	return new Promise(function(resolve, reject){
		mssql.connect(config.dbConfig)
			.then(function(){
				var request = new mssql.Request()
					.query(getTop100)
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
		"ref_domain_topical_trust_flow_value" : "number",
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
			console.log(masterQuery);
			resolve(master);
		} else {
			resolve('default');
			//no options should just default to the standard "fetch 100"
		}
	});
};

module.exports = new GetLinksService();






