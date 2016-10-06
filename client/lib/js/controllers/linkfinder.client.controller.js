'use strict';
angular.module('linkFinder').controller('GetLinksController', 
	['$scope', '$rootScope', 'GetLinksService', 'AuthorizationService', 'DomainsAndFields', 'TableOptions', 'URLParamsService', 
	'$uibModal', 'ModalTemplate', 'LoginModalTemplate', '$localStorage', '$routeParams', '$timeout',
	function($scope, $rootScope, GetLinksService, AuthorizationService, DomainsAndFields, TableOptions, URLParamsService, $uibModal, 
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
		$scope.tableOptions = TableOptions.getOptions($scope.selectedFields);
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
			$scope.$storage.auth.accessToken = data.accessToken;
			$scope.$storage.auth.username = data.username;
			$scope.$storage.auth.refreshToken = data.refreshToken;
			if(data.reattemptRequest){
				$scope.getBacklinks();
			} else {
				$scope.$emit('params.inspect');
			}
		});
		var offOpenLoginModal = $rootScope.$on('login.openModal', function(){
			openLoginModal();
		});
		var offLogout = $rootScope.$on('logout', function(){
			$scope.$storage.auth = {};
		});
		var openLoginModal = function openLoginModal(logInAgainMessage){
		    var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'loginModalTemplate.html',
				controller: 'LoginModalController',
				size: 'lg',
				resolve : {
					scopeVars : function(){
						return {
							logInAgainMessage : logInAgainMessage
						};
					}
				}
		    });
		};
		$timeout(function(){
			if(!$scope.$storage.auth.accessToken){
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
					$scope.getBacklinks(true);
				}
			});
		});
		$scope.getBacklinks = function(preserveUrl){
			$scope.loading = true;
			if(!preserveUrl){
				URLParamsService.scopeToRouteParams($scope.criteria, $scope.enabledCriteria, $scope.selectedFields);
			}
			var refreshTokenRetry = true;
			var makeGetLinksAttempt = function(){
				GetLinksService.getLinks($scope.criteria, $scope.enabledCriteria, $scope.selectedFields, $scope.$storage.auth.accessToken, $scope.$storage.auth.username)
					.then(function(response){
						$scope.loading = false;
						if(response.data && response.data.length > 1000){
							openDownloadModal(response.data);
							$scope.data = [];
						} else if (response.data){
							$scope.fieldsLastFetched = response.fieldsLastFetched;
							$scope.data = response.data;
						}
					})
					.catch(function(err){
						if(err.status === 401 && refreshTokenRetry === true){
							refreshTokenRetry = false;
							AuthorizationService.refreshToken($scope.$storage.auth.username, $scope.$storage.auth.refreshToken)
								.then(function(response){
									if(response.data){
										$scope.$storage.auth.accessToken = response.data.accessToken;
										makeGetLinksAttempt();
										//TODO: fetch a new access token, make the getLinks request again (we'll have to wrap this invocation in a new function or pass in an argument),
										//and make sure to store the new access token in localStorage
									}
								})
								.catch(function(err){
									openLoginModal("Please log in again.");
								});
						} else if (err.status === 401){
							$scope.loading = false;
							openLoginModal("Please log in again.");
						} else {
							$scope.loading = false;
						}
					});
			};
			makeGetLinksAttempt();
		};
		$scope.$on('$destroy', function(){
			offLoginSuccess();
			offOpenLoginModal();
			offLogout();
		});
	}]);