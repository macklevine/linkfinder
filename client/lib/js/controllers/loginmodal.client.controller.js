'use strict';

angular.module('linkFinder').controller('LoginModalController', ['$scope', '$rootScope', function($scope, $rootScope){
	$scope.emitToken = function emitToken(){
		$scope.$emit('login.success', {
			token : 'hoodilydoodily'
		});
	};
	$scope.emitToken();
}]);