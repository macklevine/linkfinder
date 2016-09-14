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
	if(password===config.password && (config.userNames.indexOf(user)>-1)){
		return Promise.resolve({
			username : user,
			token : self.issueToken(user)
		});
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
			expiresIn: 60*60*24 //TODO: tweak this so that it expires in less time to experiment with the behavior
		}
	);
	return token;
};

AuthService.prototype.validateRequestMiddleWare = function(){
	return function(req, res, next){
  		var token = req.headers['x-access-token'];
	  	if (token) {
		    jwt.verify(token, config.secret, function(err, decoded) {      
				if (err) {
					res.status(401).send({
						success: false, 
						message: 'Invalid token.' 
					});    
				} else {  
					next();
				}
			});
	  	} else {
	  		res.status(401).send({
	  			success: false,
	  			message: 'Invalid token.'
	  		});
	  	}
	};
};

module.exports = new AuthService();