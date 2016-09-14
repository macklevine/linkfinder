'use strict';

var authService = require('../auth/auth');

var LoginResourceHandler = function LoginResourceHandler(){};

LoginResourceHandler.prototype.getHandlerForLogin = function getHandlerForLogin(){
	return function(req, res){
		authService.verifyPassword(req.body.username, req.body.password)
			.then(function(response){
				res.status(200).send({
					success: true,
					username : response.username,
					token : response.token
				});
			})
			.catch(function(err){
				if(err==='Wrong username or password.'){
					res.status(401).send('Wrong username or password.');
				} else {
					res.status(500).send(err.message);
				}
			});
	};
};

module.exports = new LoginResourceHandler();