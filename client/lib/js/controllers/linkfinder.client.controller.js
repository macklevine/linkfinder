'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', '$rootScope', 'GetLinksService', 'DomainsAndFields', '$uibModal', 'ModalTemplate', 'LoginModalTemplate', '$timeout',
	function($scope, $rootScope, GetLinksService, DomainsAndFields, $uibModal, ModalTemplate, LoginModalTemplate, $timeout) {
		$scope.fieldsCollapsed = false;
		$scope.domains = DomainsAndFields.domains;
		$scope.fields = DomainsAndFields.fields;
		$scope.selectedFields = DomainsAndFields.selectedFields;
		$scope.auth = {};
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
		$rootScope.$on('login.success', function(e, data){
			$scope.auth.token = data.token;
		});
		$rootScope.$on('login.openModal', function(){
			openLoginModal();
		});
		$rootScope.$on('logout', function(){
			$scope.auth = {};
		});
		var openLoginModal = function openLoginModal(data){
		    var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'loginModalTemplate.html',
				controller: 'LoginModalController',
				size: 'lg'
		    });
		};
		$timeout(function(){
			openLoginModal();
		});
		var openDownloadModal = function openDownloadModal(data){
		    var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled, //review.
				templateUrl: 'modalTemplate.html',
				controller: 'ModalController',
				size: 'lg',
				resolve: {
					scopeVars : function(){
						return {
							data : data
						};
					}
				}
		    });
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
			GetLinksService.getLinks(options, $scope.auth.token)
				.then(function(response){
					if(response.data.length > 1000){
						//TODO: launch a modal with a download button and set $scope.data to an empty array.
						openDownloadModal(response.data);
					} else {
						$scope.data = response.data;
					}
				});
		};
	}]);