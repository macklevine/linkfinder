'use strict';

var testConfig = {
	databaseType : 'mysql',
	dbConfig : {
		user : 'root',
		password : '',
		server : 'localhost',
		database : 'SEO',
		requestTimeout : 30000
	},
	domainsAndTables : '[{"label":"Test Domain","tableName":"test_backlinks"}]',
	port : 3000,
	authConfig : {
		userNames : 'Mack,Sara'.split(","),
		salt : '12350990-4936-46b1-a812-4750f3d3f854',
		password : 'b9c19cc160e6815408615059a451547f253ed539',
		secret : 'G[=Na?_w~Ub^v?3_',
		secret2 : 'Cv.6-AsMW.k#C=Da'
	},
	loggerConfig : {
		name: "linkFinderLogger",
		streams: [{
			level: "debug",
			path: __dirname + '/../../log/linkFinderLog.log'
		}]
	}
};

module.exports = testConfig;

