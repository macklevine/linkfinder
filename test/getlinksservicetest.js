'use strict';

var chai = require('chai');
var expect = chai.expect;

process.env.NODE_ENV = "test";

var getLinksService = require('../server/db/getlinksservice');

describe('GetLinksService', function(){
	describe('GetLinksService - MySQL functionality', function(){
		it("should construct a query given a table name and options", function(done){
			getLinksService.constructQuery('test_table', {
			  	"ref_domain_topical_trust_flow_value": "90",
			  	"selectedFields": "target_url|source_url|source_crawl_date|source_first_found_date|ref_domain_topical_trust_flow_value"
			})
			.then(function(query){
				expect(query).to.equal("SELECT target_url,source_url,source_crawl_date,source_first_found_date,ref_domain_topical_trust_flow_value " +
											"FROM test_table " +
											"WHERE ref_domain_topical_trust_flow_value >= 90;");
				done();
			});
		});
		it("should construct a query given a table name and multiple options, chaining the additional options together as additional WHERE or LIKE clauses", function(done){
			getLinksService.constructQuery('test_table', {
			  	"ref_domain_topical_trust_flow_value": "90",
			  	"target_url" : "http://www.movoto.com/austin",
			  	"selectedFields": "target_url|source_url|source_crawl_date|source_first_found_date|ref_domain_topical_trust_flow_value"
			})
			.then(function(query){
				expect(query).to.equal("SELECT target_url,source_url,source_crawl_date,source_first_found_date,ref_domain_topical_trust_flow_value " +
											"FROM test_table " +
											"WHERE ref_domain_topical_trust_flow_value >= 90 " +
											"AND target_url LIKE '%http://www.movoto.com/austin%';");
				done();
			});
		});
		it("should default to the top 100 results for a given domain in the event no options are selected by the user", function(done){
			getLinksService.constructQuery('test_table', {
				"selectedFields": "target_url"
			})
			.then(function(query){
				expect(query).to.equal("SELECT target_url FROM test_table LIMIT 100");
				done();
			});
		});	
		it("should require that at least one field is selected to query", function(done){
			getLinksService.constructQuery('test_table', {
				"selectedFields": ""
			})
			.catch(function(err){
				expect(err).to.equal("must provide at least one selected field.");
				done();
			});
		});
		it("should reject any call that does not include a table name", function(done){
			getLinksService.constructQuery(null, {"selectedFields":"source_url"})
				.catch(function(err){
					expect(err).to.equal('must select a table.');
					done();
				});
		});
	});
});