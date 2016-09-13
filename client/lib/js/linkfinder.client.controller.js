'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', 'GetLinksService', 'DomainsAndFields',
	function($scope, GetLinksService, DomainsAndFields) {
		$scope.fieldsCollapsed = false;
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
		$scope.toggleCollapse = function(){
			$scope.fieldsCollapsed = !$scope.fieldsCollapsed;
			var element = angular.element('#caret-i');
			var up = 'fa-caret-up';
			var down = 'fa-caret-down';
			if(element.hasClass(down)){
				element.removeClass(down);
				element.addClass(up);
			} else {
				element.removeClass(up);
				element.addClass(down);
			}
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
					if(response.data.length > 1000){
						//TODO: launch a modal with a download button and set $scope.data to an empty array.
						alert('this is a lot of data to attempt to render as a sortable table in the browser. Proceed?');
					} else {
						$scope.data = response.data;
					}
				});
		};
	}]);