'use strict';
angular.module('linkFinder').factory('URLParamsService', 
	['DomainsAndFields', function(DomainsAndFields){
		var routeParamsToScope = function(routeParams){
			var criteria = {};
			var enabledCriteria = {};
			var selectedFields = [];
			var availableFields = DomainsAndFields.fields;
			var parsedFields;
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
			if(routeParams.selectedFields){
				parsedFields = routeParams.selectedFields.split("|");
				angular.forEach(parsedFields, function(parsedField){
					for(var i = 0; i < availableFields.length; i++){
						if(parsedField === availableFields[i].prop){
							selectedFields.push(availableFields[i]);
							break;
						}
					}
				});
			}
			return {
				criteria : criteria,
				enabledCriteria : enabledCriteria,
				selectedFields : selectedFields
			};
		};
		var scopeToRouteParams = function(criteria, routeParams){

		};
		return {
			routeParamsToScope : routeParamsToScope,
			scopeToRouteParams : scopeToRouteParams
		};
	}]);