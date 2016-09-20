'use strict';

var logger = require('../logger/logger');
var mssql = require('mssql');
var promise = require('bluebird');
var queries = require('./queries/queries');
var util = require('util');
var config = require('../config/config');
var optionsMapper = require('../mappers/optionsmapper');

var GetLinksService = function GetLinksService(){};

var _formatConditionWithValue = function _formatConditionWithValue(condition, value){
	if (typeof value === 'number'){
		value = value.toString();
	}
	return util.format(queries[condition], value)
};

GetLinksService.prototype.getLinks = function getLinks(tableName, options, user){
	var self = this;
	return self.constructQuery(tableName, options)
		.then(function(query){
			if(query==="default"){
				query = util.format(queries.getTop100, tableName);
			}
			logger.info({
				query : query,
				user : user
			}, 'user ' + user + ' fetching links using above query.');
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
	for (var k in options){
		if(!optionsMapper[k]){
			return false;
		}
	}
	var selectedFields = options.selectedFields.split("|");
	selectedFields.forEach(function(selectedField){
		if(!optionsMapper[selectedField]){
			return false;
		}
	});
	return valid;
};

GetLinksService.prototype.constructQuery = function constructQuery(tableName, options){
	var self = this;

	var masterQuery = queries.master;
	var defaultQuery = queries.getTop100;
	var conditions = [];
	var subQuery = "";
	var selectedFields = options.selectedFields.replace(/\|/g, ",");

	return new Promise(function(resolve, reject){
		if(!_validateOptions(options)){
			logger.error(options, 'one or more of the following fields was found to be invalid.');
			return reject('one or more of the following fields was found to be invalid');
		}
		for(var k in options){
			if(k !== "selectedFields"){
				conditions.push(_formatConditionWithValue(k, options[k]));
			}
		}
		if(conditions.length){
			for(var i = 0; i < conditions.length; i++){
				if(i === conditions.length-1){
					subQuery += conditions[i] + ";";
				} else {
					subQuery += (conditions[i] + " AND ");
				}
			}
			masterQuery = util.format(masterQuery, selectedFields, tableName, subQuery);
			resolve(masterQuery);
		} else {
			defaultQuery = util.format(defaultQuery, selectedFields, tableName);
			resolve(defaultQuery);
		}
	});
};

module.exports = new GetLinksService();






