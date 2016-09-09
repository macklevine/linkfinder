'use strict';

var config = require('./config');

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var app = express();
var server;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

server = http.createServer(app);
app.use('/', express.static(__dirname + "/../client"));

server.listen(config.port, function(){
	console.log('lead exporter listening on port ' + config.port);
});
