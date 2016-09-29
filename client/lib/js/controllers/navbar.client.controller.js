'use strict';

angular.module('linkFinder').controller('NavbarController', ['$scope', '$rootScope', '$localStorage', function($scope, $rootScope, $localStorage){
	if($localStorage.auth && $localStorage.auth.username){
		$scope.username = $localStorage.auth.username;
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