'use strict';
angular.module('linkFinder').controller('getLinksController', 
	['$scope',
	function($scope) {
		console.log("controller loaded.");
		$scope.domains = [
			{
				label : "Movoto",
				tableName : "movoto_domains"
			},
			{
				label : "Zillow",
				tableName : "zillow_domains"
			}
		];
		$scope.getBacklinks = function getBacklinks(){
			console.log('getting backlinks...');
		}
	}]);