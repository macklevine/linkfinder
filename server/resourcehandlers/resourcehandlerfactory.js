'use strict';

var getLinksResourceHandler = require('./getlinksresourcehandler');

var ResourceHandlerFactory = function ResourceHandlerFactory(){

};

ResourceHandlerFactory.prototype.getHandlerForResourceType = function getHandlerForResourceType(resource){
	switch (resource) {
		case "links": 
			return getLinksResourceHandler.getHandlerForGetLinks();
			break;
		default:
			throw new Error('unrecognized resource type.');
	}
};

module.exports = new ResourceHandlerFactory();