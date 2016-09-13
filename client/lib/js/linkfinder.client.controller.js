'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', 'GetLinksService', 'DomainsAndFields',
	function($scope, GetLinksService, DomainsAndFields) {
		console.log("controller loaded.");
		$scope.domains = DomainsAndFields.domains;
		$scope.fields = DomainsAndFields.fields;
		$scope.selectedFields = DomainsAndFields.selectedFields;
		$scope.options = {
			rowHeight: 50,
			headerHeight: 50,
			footerHeight: false,
			scrollbarV: false,
			selectable: false,
			columns: $scope.selectedFields,
			columnMode: 'force'
		};
		$scope.getBacklinks = function(){
	  		// renderTableHtml();
			var options = {
				tableName : $scope.tableName
			};
			if($scope.enableTrustFlow && $scope.trustFlow){
				options.ref_domain_topical_trust_flow_value = $scope.trustFlow;
			}
			if($scope.enableReferringUrl && $scope.referringUrlContains){
				options.source_url = $scope.referringUrlContains;
			}
			if($scope.enableTargetUrl && $scope.targetUrlContains){
				options.target_url = $scope.targetUrlContains;
			}
			GetLinksService.getLinks(options)
				.then(function(response){
					console.log(response.data);
					$scope.data = response.data;
				});
		};
	}]);