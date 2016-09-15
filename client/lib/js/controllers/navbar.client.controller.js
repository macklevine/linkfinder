'use strict';

angular.module('linkFinder').controller('NavbarController', ['$scope', '$rootScope', function($scope, $rootScope){
	$rootScope.$on('username.change', function(e, data){
		$scope.username = data.username;
	});
	$scope.logIn = function(){
		$rootScope.$emit('login.openModal');
	};
	$scope.logOut = function(){
		$scope.username = "";
		$rootScope.$emit('logout');
	}
}]);