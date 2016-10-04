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
		password : '645f43290a46999a749f9b8b7c16732186749190', //by default, all users share the same password, but you can easily tweak linkfinder to connect to an auth database!
		secret : 'TmjBQ%+e:7.~^7H&', //for signing access tokens.
		secret2 : 'Sq`g5Lc~2J5w?D!a' //for signing refresh tokens.
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

After downloading a csv of backlinks from [Majestic](http://www.majestic.com), you can use some of the utility commands in the ```/sql/``` folder to help you set up databases and tables. Change file paths and table names accordingly.

Here's the schema for a MySQL database, found in ```sql/table-mysql.sql```:
```sql
CREATE TABLE movoto_backlinks (
	target_url VARCHAR(6000) DEFAULT NULL,
	source_url VARCHAR(6000) DEFAULT NULL,
	anchor_text VARCHAR(6000) DEFAULT NULL,
	source_crawl_date DATE DEFAULT NULL,
	source_first_found_date DATE DEFAULT NULL,
	flag_no_follow CHAR(1) DEFAULT NULL,
	flag_image_link CHAR(1) DEFAULT NULL,
	flag_redirect CHAR(1) DEFAULT NULL,
	flag_frame CHAR(1) DEFAULT NULL,
	flag_old_crawl CHAR(1) DEFAULT NULL,
	flag_alt_text CHAR(1) DEFAULT NULL,
	flag_mention CHAR(1) DEFAULT NULL,
	source_citation_flow TINYINT DEFAULT NULL,
	source_trust_flow TINYINT DEFAULT NULL,
	target_citation_flow TINYINT DEFAULT NULL,
	target_trust_flow TINYINT DEFAULT NULL,
	source_topical_trust_flow_topic VARCHAR(255) DEFAULT NULL,
	source_topical_trust_flow_value TINYINT DEFAULT NULL,
	ref_domain_topical_trust_flow_topic VARCHAR(255) DEFAULT NULL,
	ref_domain_topical_trust_flow_value TINYINT DEFAULT NULL
)
```
And here's the bulk insert statement (found in ```sql/mysql-insert.sql```) you can use to populate the table with a backlink download csv fetched from Majestic SEO:

```sql
LOAD DATA INFILE '~/Downloads/backlinks.csv' INTO TABLE backlinks
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(target_url, source_url, anchor_text, source_crawl_date, source_first_found_date, flag_no_follow, flag_image_link, flag_redirect, flag_frame, flag_old_crawl, flag_alt_text, flag_mention, @vsource_citation_flow, @vsource_trust_flow, @vtarget_citation_flow, @vtarget_trust_flow, source_topical_trust_flow_topic, @vsource_topical_trust_flow_value, ref_domain_topical_trust_flow_topic, @vref_domain_topical_trust_flow_value)
SET 
source_citation_flow = nullif(@vsource_citation_flow,''),
source_trust_flow = nullif(@vsource_trust_flow,''),
target_citation_flow = nullif(@vtarget_citation_flow,''),
target_trust_flow = nullif(@vtarget_trust_flow,''),
source_topical_trust_flow_value = nullif(@vsource_topical_trust_flow_value,''),
ref_domain_topical_trust_flow_value = nullif(@vref_domain_topical_trust_flow_value,'');

```

##running tests
```
mocha test
```

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