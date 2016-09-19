'use strict';

var bunyan = require('bunyan');
var config = require('../config/config').loggerConfig;

module.exports = bunyan.createLogger(config);