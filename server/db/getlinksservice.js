'use strict';

var config = require('../config/config');
var logger = require('../logger/logger');
var promise = require('bluebird');
var util = require('util');
var optionsMapper = require('../mappers/optionsmapper');
var connectionManager = require('./connectionmanager');

var queries;

if(config.databaseType === 'mysql'){
	queries = require('./queries/queries').mysql;
} else {
	queries = require('./queries/queries').mssql;
}

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
		connectionManager.getConnection()
			.then(function(connection){
				return connectionManager.executeQuery(query, connection);
			})
			.then(function(rows){
				resolve(rows);
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
	if(options.selectedFields){
		var selectedFields = options.selectedFields.split("|");
		selectedFields.forEach(function(selectedField){
			if(!optionsMapper[selectedField]){
				return false;
			}
		});
	}
	return valid;
};

GetLinksService.prototype.constructQuery = function constructQuery(tableName, options){
	var self = this;
	var masterQuery = queries.master;
	var defaultQuery = queries.getTop100;
	var conditions = [];
	var subQuery = "";
	var selectedFields =  options.selectedFields ? options.selectedFields.replace(/\|/g, ",") : "";
	return new Promise(function(resolve, reject){
		if(!tableName){
			return reject('must select a table.');
		}
		if(!selectedFields && !options.countOnly){
			return reject('must provide at least one selected field.');
		}
		if(!_validateOptions(options)){
			logger.error(options, 'one or more of the following fields was found to be invalid.');
			return reject('one or more of the following fields was found to be invalid');
		}
		for(var k in options){
			if(k !== "selectedFields" && k !== "exactMatch" && k !== "countOnly"){
				conditions.push(_formatConditionWithValue(k, options[k]));
			}
			if(k==="exactMatch"){
				conditions.push(_formatConditionWithValue("target_url_exact_match", options.target_url));
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
			masterQuery = options.countOnly ? util.format(masterQuery, "COUNT(*) AS n", tableName, subQuery) : util.format(masterQuery, selectedFields, tableName, subQuery);
			resolve(masterQuery);
		} else {
			defaultQuery = util.format(defaultQuery, selectedFields, tableName);
			resolve(defaultQuery);
		}
	});
};

module.exports = new GetLinksService();
