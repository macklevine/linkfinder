'use strict';
angular.module('linkFinder').factory('URLParamsService', 
	['DomainsAndFields', '$location', '$interpolate', function(DomainsAndFields, $location, $interpolate){
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
		var _constructSelectedFields = function(selectedFields){
			var returnFields = [];
			angular.forEach(selectedFields, function(field){
				returnFields.push(field.prop);
			});
			returnFields = returnFields.join('|');
			console.log(returnFields);
			return returnFields;
		};
		var scopeToRouteParams = function(criteria, enabledCriteria, selectedFields){//pass a copy of the last selected options.
			var params = {
				find : "1",
				tableName : criteria.tableName
			};
			if(criteria.targetUrlContains && enabledCriteria.enableTargetUrl){
				params.target_url = criteria.targetUrlContains;
			}
			if(criteria.referringUrlContains && enabledCriteria.enableReferringUrl){
				params.source_url = criteria.referringUrlContains;
			}
			if(criteria.trustFlow && enabledCriteria.enableTrustFlow){
				params.ref_domain_topical_trust_flow_value = criteria.trustFlow;
			}
			if(selectedFields.length){
				params.selectedFields = _constructSelectedFields(selectedFields);
			}
			$location.search(params);
		};
		return {
			routeParamsToScope : routeParamsToScope,
			scopeToRouteParams : scopeToRouteParams
		};
	}]);