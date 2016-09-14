'use strict';
angular.module('linkFinder').factory('AuthorizationService', ['$http', '$q', function($http, $q){
	var AuthorizationService = {};	
	AuthorizationService.login = function(username, password){
		return $http.post('/login', {
			username : username,
			password : password
		});
	};
	return AuthorizationService;
}]);