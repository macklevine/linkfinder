'use strict';

var devconfig;
var testconfig;

var production = {
	databaseType : process.env.DB_TYPE || 'mssql', 
	dbConfig : {
		user : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		server : process.env.DB_SERVER,
		database : process.env.DB_NAME,
		requestTimeout : 30000
	},
	domainsAndTables : process.env.DOMAINS_AND_TABLES ? JSON.parse(process.env.DOMAINS_AND_TABLES) : {},
	port : process.env.PORT,
	authConfig : {
		userNames : process.env.USERS ? process.env.USERS.split(",") : [],
		salt : process.env.SALT,
		password : process.env.PASSWORD,
		secret : process.env.SECRET,
		secret2 : process.env.SECRET_2
	},
	loggerConfig : {
		name: "linkFinderLogger",
		streams: [{
			level: "debug",
			path: __dirname + '/../../log/linkFinderLog.log'
		}]
	}
};

if(process.env.NODE_ENV==="development"){
	devconfig = require("./devconfig");
	module.exports = devconfig;
} else if (process.env.NODE_ENV==="test") {
	testconfig = require('./testconfig');
	module.exports = testconfig;
} else {
	module.exports = production;
}