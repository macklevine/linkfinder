'use strict';

var endpoints = require('../config/endpoints');
var resourceHandlerFactory = require('../resourcehandlers/resourcehandlerfactory');
var authService = require('../auth/auth');

var ResourceRouterFactory = function ResourceRouterFactory(){};

ResourceRouterFactory.prototype.addResourceRoutes = function addResourceRoutes(app){
	app.get(endpoints['links'], [authService.validateRequestMiddleWare(), resourceHandlerFactory.getHandlerForResourceType('links')]);
	app.post(endpoints['login'], resourceHandlerFactory.getHandlerForResourceType('login'));
};

module.exports = new ResourceRouterFactory();