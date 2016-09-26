#linkfinder

Link Finder is an Angular.js and Node.js app that queries a SQL Server or MySQL database for backlinks gleaned from Majestic SEO. It allows users who are not familiar with SQL syntax to search for links and export the results of their queries as .csv files for further manipulation and analysis in Excel.

![Demonstration](./linkfinderdemo.gif?raw=true "Demonstration")

##creating a dev config file

Have a look at the structure of server/config/config.js. This config file is used for production For development purposes, you can create a file on the path server/config/devconfig.js with hard-coded string values that will be used when gulp is run.

```javascript
'use strict';

var config = {
	databaseType : 'mssql',
	dbConfig : {
		user : 'username',
		password : 'password',
		server : 'localhost',
		database : 'SEODatabase',
		requestTimeout : 30000 //ignored if you're using MySQL
	},
	domainsAndTables : '[{"label":"YourDomain","tableName":"your_domain_table_name"},{"label":"YourCompetitor","tableName":"your_competitor_table_name"}]', //a JSON string.
	port : 3000,
	authConfig : {
		userNames : 'Mack,Sara'.split(","), //this mimics how config.js allows a comma-separated string to be entered as an environment variable. Of course, you can choose to simply enter an array here.
		salt : '1d1d38e3-3692-452b-b531-f76507a20848', //review auth.js to see how a password is generated using the salt and hashing function
		password : '645f43290a46999a749f9b8b7c16732186749190',
		secret : 'TmjBQ%+e:7.~^7H&' //for signing tokens.
	},
	loggerConfig : {
		name: "linkFinderLogger",
		streams: [{
			level: "debug",
			path: 'log/linkFinderLog.log'
		}]
	}
};

module.exports = config;

```

##setting up databases

After downloading a csv of backlinks from [Majestic](http://www.majestic.com), you can use some of the utility commands in the /sql/ folder to help you set up databases and tables. Change file paths and table names accordingly.

##building the app for development

```
npm install
bower install
gulp
```

##building the app for deployment

```
npm install
bower install
gulp release
```

##TODO
Tests
Streaming results of large queries