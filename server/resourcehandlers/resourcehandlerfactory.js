'use strict';

var getLinksResourceHandler = require('./getlinksresourcehandler');
var loginResourceHandler = require('./loginresourcehandler');
var refreshTokenResourceHandler = require('./refreshtokenresourcehandler');

var ResourceHandlerFactory = function ResourceHandlerFactory(){

};

ResourceHandlerFactory.prototype.getHandlerForResourceType = function getHandlerForResourceType(resource){
	switch (resource) {
		case "links": 
			return getLinksResourceHandler.getHandlerForGetLinks();
			break;
		case "login":
			return loginResourceHandler.getHandlerForLogin();
			break;
		case "refreshToken":
			return refreshTokenResourceHandler.getHandlerForRefreshToken();
			break;
		default:
			throw new Error('unrecognized resource type.');
	}
};

module.exports = new ResourceHandlerFactory();