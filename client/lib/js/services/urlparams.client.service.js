'use strict';
angular.module('linkFinder').factory('URLParamsService', 
	[function(){
		var routeParamsToScope = function(routeParams){
			var criteria = {};
			var enabledCriteria = {};
			criteria.tableName = routeParams.tableName;
			if(routeParams.ref_domain_topical_trust_flow_value){
				enabledCriteria.enableTrustFlow = true;
				criteria.trustFlow = routeParams.ref_domain_topical_trust_flow_value;
			}
			if(routeParams.source_url){
				enabledCriteria.enableReferringUrl = true;
				criteria.referringUrlContains = routeParams.source_url;
			}
			if(routeParams.target_url){
				enabledCriteria.enableTargetUrl = true;
				criteria.targetUrlContains = routeParams.target_url;
			}
			return {
				criteria : criteria,
				enabledCriteria : enabledCriteria
			};
		};
		var scopeToRouteParams = function(criteria, routeParams){

		};
		return {
			routeParamsToScope : routeParamsToScope,
			scopeToRouteParams : scopeToRouteParams
		};
	}]);