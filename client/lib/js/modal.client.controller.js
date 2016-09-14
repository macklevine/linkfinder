'use strict';

angular.module('linkFinder').controller('ModalController', 
	['$scope', 'DomainsAndFields', '$uibModalInstance', 'scopeVars', 
	function($scope, DomainsAndFields, $uibModalInstance, scopeVars){
		$scope.ok = function () {
			$uibModalInstance.close();
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}]);