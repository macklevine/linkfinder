'use strict';
angular.module('linkFinder').factory('DomainsAndFields', 
	function(){
		var domains = [
			{
				label : "Movoto",
				tableName : "movoto_backlinks_august"
			},
			{
				label : "Zillow",
				tableName : "zillow_backlinks_august"
			},
			{
				label : "Trulia",
				tableName : "trulia_backlinks_otto"
			},
			{
				label : "Estately",
				tableName : "estately_backlinks_otto"
			},
			{
				label : "Homes",
				tableName : "homes_backlinks_otto"
			}
		];
		var fields = [
			{
				name: 'target_url',
				label: 'Target URL'
			},
			{
				name: 'source_url',
				label: 'Source URL'
			},
			{
				name: 'anchor_text',
				label: 'Anchor Text'
			},
			{
				name: 'flag_no_follow',
				label: "No Follow?"
			},
			{
				name: 'flag_image_link',
				label: "Image Link?"
			},
			{
				name: 'flag_redirect',
				label: "Redirect?"
			},
			{
				name: 'flag_frame',
				label: "iFrame?"
			},
			{
				name: 'flag_old_crawl',
				label: "Old Crawl?"
			},
			{
				name: 'flag_alt_text',
				label: "Alt Text?"
			},
			{
				name: 'flag_mention',
				label: "Mention?"
			},
			{
				name: 'source_citation_flow',
				label: 'Source Citation Flow'
			},
			{
				name: 'source_trust_flow',
				label:'Source Trust Flow'
			},
			{
				name: 'target_citation_flow',
				label: "Target Citation Flow"
			},
			{
				name: 'target_trust_flow',
				label: "Target Trust Flow"
			},
			{
				name: 'source_topical_trust_flow_topic',
				label: 'Source Topic'
			},
			{
				name: 'source_topical_trust_flow_value',
				label: 'Source Trust Flow'
			},
			{
				name: 'ref_domain_topical_trust_flow_topic',
				label: 'Domain Topic'
			},
			{
				name: 'ref_domain_topical_trust_flow_value',
				label: 'Domain Trust Flow'
			}
		];
		return {
			domains : domains,
			fields : fields
		};
	});