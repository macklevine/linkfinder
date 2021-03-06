'use strict';

var config = require('./config/config');
var resourceRouterFactory = require('./routeconfigurators/resourcerouterfactory');

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', express.static(__dirname + "/../client"));
app.get('/domainsandtables', function(req, res){
	res.status(200).send(config.domainsAndTables);
});
resourceRouterFactory.addResourceRoutes(app);

server = http.createServer(app);
server.listen(config.port, function(){
	console.log('link finder backend listening on port ' + config.port);
});
