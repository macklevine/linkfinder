'use strict';
angular.module('linkFinder').factory('DomainsAndFields', 
	['$http', '$q', function($http, $q){
		var deferred = $q.defer();
		$http.get('/domainsandtables')
			.then(function(response){
				deferred.resolve(response.data);
			}); //TODO: handle rejections
		var fields = [
			{
				prop: 'target_url',
				name: 'Target URL'
			},
			{
				prop: 'source_url',
				name: 'Source URL'
			},
			{
				prop: 'source_crawl_date',
				name: 'Source Crawled'
			},
			{
				prop: 'source_first_found_date',
				name: 'First Found'
			},
			{
				prop: 'anchor_text',
				name: 'Anchor Text'
			},
			{
				prop: 'flag_no_follow',
				name: 'No Follow?'
			},
			{
				prop: 'flag_image_link',
				name: 'Image Link?'
			},
			{
				prop: 'flag_redirect',
				name: 'Redirect?'
			},
			{
				prop: 'flag_frame',
				name: 'iFrame?'
			},
			{
				prop: 'flag_old_crawl',
				name: 'Old Crawl?'
			},
			{
				prop: 'flag_alt_text',
				name: 'Alt Text?'
			},
			{
				prop: 'flag_mention',
				name: 'Mention?'
			},
			{
				prop: 'source_citation_flow',
				name: 'Source Citation Flow'
			},
			{
				prop: 'source_trust_flow',
				name:'Source Trust Flow'
			},
			{
				prop: 'target_citation_flow',
				name: 'Target Citation Flow'
			},
			{
				prop: 'target_trust_flow',
				name: 'Target Trust Flow'
			},
			{
				prop: 'source_topical_trust_flow_topic',
				name: 'Source Topic'
			},
			{
				prop: 'source_topical_trust_flow_value',
				name: 'Source Trust Flow'
			},
			{
				prop: 'ref_domain_topical_trust_flow_topic',
				name: 'Domain Topic'
			},
			{
				prop: 'ref_domain_topical_trust_flow_value',
				name: 'Domain Trust Flow'
			}
		];
		var csvColumns = [];
		var csvHeaders = [];
		fields.forEach(function(field){
			csvColumns.push(field.prop);
			csvHeaders.push(field.name);
		});
		var selectedFields = [
			fields[0],
			fields[1],
			fields[2],
			fields[3],
			fields[fields.length-1]
		];
		return {
			domainsAndTables : deferred.promise,
			fields : fields,
			selectedFields : selectedFields,
			csvColumns : csvColumns,
			csvHeaders : csvHeaders
		};
	}]);