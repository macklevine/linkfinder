'use strict';

angular.module('linkFinder').controller('LoginModalController', [
	'$scope', '$rootScope', 'AuthorizationService', '$uibModalInstance', 'scopeVars', '$timeout',
	function($scope, $rootScope, AuthorizationService, $uibModalInstance, scopeVars, $timeout){
		if(scopeVars.logInAgainMessage){
			$scope.logInAgainMessage = scopeVars.logInAgainMessage;
		}
		$scope.ok = function () {
			AuthorizationService.login($scope.username, $scope.password)
				.then(function(response){
					if(response.data && response.data.success==true){
						$scope.showSuccessMessage = true;
						var reattemptRequest = false;
						if($scope.logInAgainMessage){
							$scope.logInAgainMessage = "";
							reattemptRequest = true;
						}
						$rootScope.$emit('login.success', {
							token : response.data.token,
							username : response.data.username,
							reattemptRequest : reattemptRequest
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