'use strict';

angular.module('linkFinder').controller('LoginModalController', [
	'$scope', '$rootScope', 'AuthorizationService', '$uibModalInstance', '$timeout',
	function($scope, $rootScope, AuthorizationService, $uibModalInstance, $timeout){
		$scope.ok = function () {
			AuthorizationService.login($scope.username, $scope.password)
				.then(function(response){
					if(response.data && response.data.success==true){
						$scope.showSuccessMessage = true;
						$rootScope.$emit('login.success', {
							token : response.data.token
						});
						//$rootScope and $scope are equivalent here.
						//I may want to give this modal its own scope.
						$rootScope.$emit('username.change', {
							username : response.data.username
						});
						$timeout(function(){
							$uibModalInstance.close();
						}, 1000);
					};
				},
				function(err){
					$scope.showErrorMessage = true;
				});
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
}]);