'use strict';
angular.module('linkFinder').factory('GetLinksService', 
	['$http', function($http){
		var getLinks = function(options, token){
			return $http({
				url : '/links',
				method : 'GET',
				headers : {
					"x-access-token" : token
				},
				params : options
			});
		};
		return {
			getLinks : getLinks
		};
	}]);