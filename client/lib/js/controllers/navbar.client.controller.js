'use strict';

angular.module('linkFinder').controller('NavbarController', ['$scope', '$rootScope', '$sessionStorage', function($scope, $rootScope, $sessionStorage){
	if($sessionStorage.auth && $sessionStorage.auth.username){
		$scope.username = $sessionStorage.auth.username;
	}
	$rootScope.$on('login.success', function(e, data){
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