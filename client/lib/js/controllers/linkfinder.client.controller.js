'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', '$rootScope', 'GetLinksService', 'DomainsAndFields', '$uibModal', 'ModalTemplate', 'LoginModalTemplate', '$localStorage', '$routeParams', '$timeout',
	function($scope, $rootScope, GetLinksService, DomainsAndFields, $uibModal, ModalTemplate, LoginModalTemplate, $localStorage, $routeParams, $timeout) {
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
		$scope.options = {
			loadingMessage: "No links fetched.",
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
				//TODO: add option to modify $scope.selectedFields by pushing every field found in $routeParams separated by pipes.
				if($routeParams.find === "1" && $routeParams.tableName){
					$scope.criteria.tableName = $routeParams.tableName;
					if($routeParams.ref_domain_topical_trust_flow_value){
						$scope.enabledCriteria.enableTrustFlow = true;
						$scope.criteria.trustFlow = $routeParams.ref_domain_topical_trust_flow_value;
					}
					if($routeParams.source_url){
						$scope.enabledCriteria.enableReferringUrl = true;
						$scope.criteria.referringUrlContains = $routeParams.source_url;
					}
					if($routeParams.target_url){
						$scope.enabledCriteria.enableTargetUrl = true;
						$scope.criteria.targetUrlContains = $routeParams.target_url;
					}
					$scope.getBacklinks();
				}
			});
		});
		$scope.getBacklinks = function(){
			$scope.loading = true;
			var fieldsLastFetched = [];
			var options = {
				tableName : $scope.criteria.tableName
			};
			if($scope.enabledCriteria.enableTrustFlow && $scope.criteria.trustFlow){
				options.ref_domain_topical_trust_flow_value = $scope.criteria.trustFlow;
			}
			if($scope.enabledCriteria.enableReferringUrl && $scope.criteria.referringUrlContains){
				options.source_url = $scope.criteria.referringUrlContains;
			}
			if($scope.enabledCriteria.enableTargetUrl && $scope.criteria.targetUrlContains){
				options.target_url = $scope.criteria.targetUrlContains;
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
					$scope.loading = false;
					if(response.data.length > 1000){
						openDownloadModal(response.data);
					} else {
						$scope.fieldsLastFetched = fieldsLastFetched;
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