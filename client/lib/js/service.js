'use strict';
angular.module('linkFinder').factory('GetLinksService', 
	function($http, $q){
		var getLinks = function(options){
			return $http({
				url : '/links',
				method : 'GET',
				params : options
			})
			.then(function(response){
				return $q.resolve(response);
			});
		};
		return {
			getLinks : getLinks
		};
	});