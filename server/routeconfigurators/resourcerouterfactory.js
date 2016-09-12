'use strict';

var endpoints = require('../config/endpoints');
var resourceHandlerFactory = require('../resourcehandlers/resourcehandlerfactory');

var ResourceRouterFactory = function ResourceRouterFactory(){};

ResourceRouterFactory.prototype.addResourceRoutes = function addResourceRoutes(app){
	app.get(endpoints['links'], resourceHandlerFactory.getHandlerForResourceType('links'));
};

module.exports = new ResourceRouterFactory();