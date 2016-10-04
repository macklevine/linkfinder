'use strict';

var logger = require('../logger/logger');
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
		var tokens = self.issueTokens(user, true);
		return Promise.resolve({
			username : user,
			accessToken : tokens.accessToken,
			refreshToken : tokens.refreshToken
		});
	} else {
		return Promise.reject('Wrong username or password.');
	}
};

AuthService.prototype.issueTokens = function(user, addRefreshToken){
	logger.info({
		user : user
	}, 'user ' + user + ' has successfully signed in and retrieved a token.');
	var self = this;
	var accessToken = jwt.sign({
			name : user,
			password : config.password
		}, 
		config.secret, 
		{
			expiresIn: 60*60
		}
	);
	var refreshToken;
	if(addRefreshToken){
		refreshToken = jwt.sign({
				name : user,
				password : config.password
			},
			config.secret2,
			{
				expiresIn: 60*60*24
			}
		);
		return {
			accessToken : accessToken,
			refreshToken : refreshToken
		};
	} 
	return {
		accessToken : accessToken
	};
};

AuthService.prototype.refreshToken = function(refreshToken, userId){
	var self = this;
	return new Promise(function(resolve, reject){
		jwt.verify(refreshToken, config.secret2, function(err, decoded) {
			if(err) {
				reject({
					success: false,
					message : 'Invalid refresh token.'
				});
			} else if(decoded.name !== userId){
				reject({
					success : false,
					message : 'x-userid value does not match user claim in token.'
				});
			} else {
				resolve({
					accessToken : self.issueTokens(decoded.name).accessToken,
					refreshToken : refreshToken
				});
			}
		});
	});
};

AuthService.prototype.validateRequestMiddleWare = function(){
	return function(req, res, next){
  		var token = req.headers['authorization'];
  		var userId = req.headers['x-userid'];
	  	if (token && userId) {
		    jwt.verify(token.split(" ")[1], config.secret, function(err, decoded) {      
				if (err) {
					res.status(401).send({
						success: false, 
						message: 'Invalid token.' 
					});    
				} else if (decoded.name !== userId){ //token must match the user.
					res.status(401).send({
						success: false, 
						message: 'x-userid value does not match user claim in token.' 
					});    
				}else {  
					req.user = decoded.name;
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