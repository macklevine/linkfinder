'use strict';

var authService = require('../auth/auth');

var RefreshTokenResourceHandler = function RefreshTokenResourceHandler(){

};

RefreshTokenResourceHandler.prototype.getHandlerForRefreshToken = function getHandlerForRefreshToken(){
	return function(req, res){
		var refreshToken = req.headers.authorization;
		if(refreshToken){
			refreshToken = refreshToken.split(' ')[1];
		}
		var userId = req.headers['x-userid'];
		//TODO: add validation that rejects with a bad request error in the event no token or x-userid value is passed.
		authService.refreshToken(refreshToken, userId)
			.then(function(response){
				console.log(response);
				res.status(200).send(response);
			})
			.catch(function(err){
				res.status(401).send(err);
			});
	};
};

module.exports = new RefreshTokenResourceHandler();