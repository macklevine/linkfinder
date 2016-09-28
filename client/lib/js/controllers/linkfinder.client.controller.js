'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', '$rootScope', 'GetLinksService', 'DomainsAndFields', 'TableOptions', 'URLParamsService', 
	'$uibModal', 'ModalTemplate', 'LoginModalTemplate', '$localStorage', '$routeParams', '$timeout',
	function($scope, $rootScope, GetLinksService, DomainsAndFields, TableOptions, URLParamsService, $uibModal, 
		ModalTemplate, LoginModalTemplate, $localStorage, $routeParams, $timeout) {
		$scope.fieldsCollapsed = false;
		$scope.loading = false;
		$scope.enabledCriteria = {};
		$scope.criteria = {};
		var domainsAndTables = DomainsAndFields.domainsAndTables;
		domainsAndTables.then(function(fetchedDomainsAndTables){
			$scope.domains  = fetchedDomainsAndTables;
		});
		$scope.domains = DomainsAndFields.domains;
		$scope.fields = DomainsAndFields.fields;
		$scope.selectedFields = DomainsAndFields.selectedFields;
		$scope.csvColumns = DomainsAndFields.csvColumns;
		$scope.csvHeaders = DomainsAndFields.csvHeaders;
		$scope.$storage = $localStorage;
		if(!$scope.$storage.auth){
			$scope.$storage.auth = {};
		} else {
			$timeout(function(){
				$scope.$emit('params.inspect');
			});
		}
		$scope.fieldsLastFetched = [];
		$scope.tableOptions = TableOptions;
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
		var offLoginSuccess = $rootScope.$on('login.success', function(e, data){
			$scope.$storage.auth.token = data.token;
			$scope.$storage.auth.username = data.username;
			$scope.$emit('params.inspect');
		});
		var offOpenLoginModal = $rootScope.$on('login.openModal', function(){
			openLoginModal();
		});
		var offLogout = $rootScope.$on('logout', function(){
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
		$scope.$on('params.inspect', function(){
			$timeout(function(){
				if($routeParams.find === "1" && $routeParams.tableName){
					var routeParamsToScope = URLParamsService.routeParamsToScope($routeParams);
					$scope.criteria = routeParamsToScope.criteria;
					$scope.enabledCriteria = routeParamsToScope.enabledCriteria;
					if(routeParamsToScope.selectedFields.length){
						$scope.selectedFields = routeParamsToScope.selectedFields;
					}
					$scope.getBacklinks();
				}
			});
		});
		$scope.getBacklinks = function(){
			$scope.loading = true;
			GetLinksService.getLinks($scope.criteria, $scope.enabledCriteria, $scope.selectedFields, $scope.$storage.auth.token)
				.then(function(response){
					$scope.loading = false;
					if(response.data.length > 1000){
						openDownloadModal(response.data);
					} else {
						$scope.fieldsLastFetched = response.fieldsLastFetched;
						$scope.data = response.data;
					}
				});
		};
		$scope.$on('$destroy', function(){
			offLoginSuccess();
			offOpenLoginModal();
			offLogout();
		});
	}]);