'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', 'GetLinksService', 'DomainsAndFields',
	function($scope, GetLinksService, DomainsAndFields) {
		console.log("controller loaded.");
		$scope.domains = DomainsAndFields.domains;
		$scope.fields = DomainsAndFields.fields;
	  	$scope.options = {
		    scrollbarV: false,
		    emptyMessage: "no data available"
	  	};
	  	$scope.selectedColumns = [];

	  	/*
	  	                    <label class="col-xs-6 col-sm-6 col-md-4" ng-repeat="value in specialities">
                        <div class="checkbox-div">
                        <input type="checkbox" checklist-model="profile.formData.specialities" checklist-value="value">
                        </div>
                        <div class="checkbox-value">
                        {{value}}
                        </div>
                    </label>

	  	 */



	  	var renderTableHtml = function(){
	  		console.log(angular.element('#data-table-wrapper'));
	  	};
	  	renderTableHtml();
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