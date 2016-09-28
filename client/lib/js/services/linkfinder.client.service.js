'use strict';
angular.module('linkFinder').factory('GetLinksService', 
	['$http', function($http){
		var getLinks = function(criteria, enabledCriteria, selectedFields, token){
			var options = {
				tableName : criteria.tableName
			};
			var fieldsLastFetched = [];
			if(enabledCriteria.enableTrustFlow && criteria.trustFlow){
				options.ref_domain_topical_trust_flow_value = criteria.trustFlow;
			}
			if(enabledCriteria.enableReferringUrl && criteria.referringUrlContains){
				options.source_url = criteria.referringUrlContains;
			}
			if(enabledCriteria.enableTargetUrl && criteria.targetUrlContains){
				options.target_url = criteria.targetUrlContains;
			}
			options.selectedFields = "";
			angular.forEach(selectedFields, function(field, index, array){
				fieldsLastFetched.push(field);
				if(index === array.length-1){
					options.selectedFields += field.prop;
				} else {
					options.selectedFields += (field.prop + "|");
				}
			});
			return $http({
				url : '/links',
				method : 'GET',
				headers : {
					"x-access-token" : token
				},
				params : options
			})
			.then(function(response){
				response.fieldsLastFetched = fieldsLastFetched;
				return response;
			})
		};
		return {
			getLinks : getLinks
		};
	}]);