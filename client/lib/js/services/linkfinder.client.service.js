'use strict';
angular.module('linkFinder').factory('GetLinksService', 
	[function($http, $q){
		var getLinks = function(options, token){
			return $http({
				url : '/links',
				method : 'GET',
				headers : {
					"x-access-token" : token
				},
				params : options
			})
			.then(function(response){
				return $q.resolve(response);
			});
		};
		return {
			getLinks : getLinks
		};
	}]);