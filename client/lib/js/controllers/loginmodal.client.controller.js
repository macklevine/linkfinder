'use strict';

angular.module('linkFinder').controller('LoginModalController', [
	'$scope', '$rootScope', 'AuthorizationService', '$uibModalInstance',
	function($scope, $rootScope, AuthorizationService, $uibModalInstance){
		$scope.ok = function () {
			AuthorizationService.login($scope.username, $scope.password)
				.then(function(response){
					console.log(response.data);
					$scope.$emit('login.success', {
						token : response.data.token
					});
					$uibModalInstance.close();
				},
				function(err){
					//TODO: add some error message to be displayed within the modal
					//indicating a wrong username or password.
					console.log(err);
				});
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
}]);