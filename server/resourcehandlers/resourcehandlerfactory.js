'use strict';

var getLinksResourceHandler = require('./getlinksresourcehandler');
var loginResourceHandler = require('./loginresourcehandler');

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
		default:
			throw new Error('unrecognized resource type.');
	}
};

module.exports = new ResourceHandlerFactory();