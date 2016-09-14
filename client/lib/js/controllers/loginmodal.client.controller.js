'use strict';

angular.module('linkFinder').controller('LoginModalController', [
	'$scope', '$rootScope', 'AuthorizationService', '$uibModalInstance', '$timeout',
	function($scope, $rootScope, AuthorizationService, $uibModalInstance, $timeout){
		$scope.ok = function () {
			AuthorizationService.login($scope.username, $scope.password)
				.then(function(response){
					if(response.data && response.data.success==true){
						$scope.showSuccessMessage = true;
						$scope.$emit('login.success', {
							token : response.data.token
						});
						$timeout(function(){
							$uibModalInstance.close();
						}, 1000);
					};
				},
				function(err){
					$scope.showErrorMessage = true;
					//TODO: add some error message to be displayed within the modal
					//indicating a wrong username or password.
					console.log(err);
				});
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
}]);