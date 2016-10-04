'use strict';
angular.module('linkFinder').factory('AuthorizationService', ['$http', '$q', function($http, $q){
	var AuthorizationService = {};	
	AuthorizationService.login = function(username, password){
		return $http.post('/login', {
			username : username,
			password : password
		});
	};
	AuthorizationService.refreshToken = function(username, token){
		return $http({
			method : 'POST',
			url : '/refreshtoken',
			headers : {
				'Authorization' : 'Bearer ' + token,
				'x-userid' : username
			}
		});
	}
	return AuthorizationService;
}]);