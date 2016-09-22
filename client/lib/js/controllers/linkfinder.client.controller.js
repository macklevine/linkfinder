'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', '$rootScope', 'GetLinksService', 'DomainsAndFields', '$uibModal', 'ModalTemplate', 'LoginModalTemplate', '$sessionStorage', '$timeout',
	function($scope, $rootScope, GetLinksService, DomainsAndFields, $uibModal, ModalTemplate, LoginModalTemplate, $sessionStorage, $timeout) {
		$scope.fieldsCollapsed = false;
		var domainsAndTables = DomainsAndFields.domainsAndTables;
		domainsAndTables.then(function(fetchedDomainsAndTables){
			$scope.domains  = fetchedDomainsAndTables;
		});
		$scope.domains = DomainsAndFields.domains;
		$scope.fields = DomainsAndFields.fields;
		$scope.selectedFields = DomainsAndFields.selectedFields;
		$scope.csvColumns = DomainsAndFields.csvColumns;
		$scope.csvHeaders = DomainsAndFields.csvHeaders;
		$scope.$storage = $sessionStorage;
		if(!$scope.$storage.auth){
			$scope.$storage.auth = {};
		}
		$scope.fieldsLastFetched = [];
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
			$scope.$storage.auth.token = data.token;
			$scope.$storage.auth.username = data.username;
		});
		$rootScope.$on('login.openModal', function(){
			openLoginModal();
		});
		$rootScope.$on('logout', function(){
			$scope.$storage.auth = {};
		});
		var openLoginModal = function openLoginModal(data){
		    var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'loginModalTemplate.html',
				controller: 'LoginModalController',
				size: 'lg'
		    });
		};
		$timeout(function(){
			if(!$scope.$storage.auth.token){
				openLoginModal();
			}
		});
		var openDownloadModal = function openDownloadModal(data){
		    var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modalTemplate.html',
				controller: 'ModalController',
				size: 'lg',
				resolve: {
					scopeVars : function(){
						return {
							data : data,
							csvColumns : $scope.csvColumns,
							csvHeaders : $scope.csvHeaders
						};
					}
				}
		    });
		};
		$scope.getBacklinks = function(){
			var fieldsLastFetched = [];
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
			options.selectedFields = "";
			angular.forEach($scope.selectedFields, function(field, index, array){
				fieldsLastFetched.push(field);
				if(index === array.length-1){
					options.selectedFields += field.prop;
				} else {
					options.selectedFields += (field.prop + "|");
				}
			});
			GetLinksService.getLinks(options, $scope.$storage.auth.token)
				.then(function(response){
					if(response.data.length > 1000){
						openDownloadModal(response.data);
					} else {
						$scope.fieldsLastFetched = fieldsLastFetched;
						$scope.data = response.data;
					}
				});
		};
	}]);