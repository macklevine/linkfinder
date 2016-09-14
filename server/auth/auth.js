'use strict';

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

var config = require('../config/config').authConfig;

var AuthService = function AuthService(){};

AuthService.prototype.verifyPassword = function verifyPassword(user, password){
	var self = this;
	var shasum = crypto.createHash('sha1');
	shasum.update(password+config.salt);
	password = shasum.digest('hex');
	console.log(password);
	console.log(config.password);
	if(password===config.password && user === config.user){
		return Promise.resolve(self.issueToken(user));
	} else {
		return Promise.reject('Wrong username or password.');
	}
};

AuthService.prototype.issueToken = function(user){
	var self = this;
	var token = jwt.sign({
			name : user,
			password : config.password
		}, 
		config.secret, 
		{
			expiresIn: 60*60*24 
		}
	);
	return token;
};

// var authService = new AuthService();
// authService.verifyPassword('linkFinderFrontEnd', 'Movoto2016')
// 	.then(function(token){
// 		console.log(token);
// 	});

module.exports = new AuthService();