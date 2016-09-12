'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', 'GetLinksService',
	function($scope, GetLinksService) {
		console.log("controller loaded.");
		$scope.domains = [
			{
				label : "Movoto",
				tableName : "movoto_backlinks_august"
			},
			{
				label : "Zillow",
				tableName : "zillow_backlinks_august"
			},
			{
				label : "Trulia",
				tableName : "trulia_backlinks_otto"
			},
			{
				label : "Estately",
				tableName : "estately_backlinks_otto"
			},
			{
				label : "Homes",
				tableName : "homes_backlinks_otto"
			}
		];
	  	$scope.options = {
		    scrollbarV: false,
		    emptyMessage: "no data available"
	  	};
	  	  $scope.data = [
		    { name: 'Austin', gender: 'Male' },
		    { name: 'Marjan', gender: 'Male' }
		  ];
		$scope.getBacklinks = function(){
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