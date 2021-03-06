'use strict';

angular.module('linkFinder').controller('ModalController', 
	['$scope', 'DomainsAndFields', '$uibModalInstance', 'scopeVars', 
	function($scope, DomainsAndFields, $uibModalInstance, scopeVars){
		$scope.data = scopeVars.data;
		$scope.csvColumns = scopeVars.csvColumns;
		$scope.csvHeaders = scopeVars.csvHeaders;
		$scope.ok = function () {
			$uibModalInstance.close();
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}]);