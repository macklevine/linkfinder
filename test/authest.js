'use strict';

var chai = require('chai');
var expect = chai.expect;

process.env.NODE_ENV = "test";

var authService = require('../server/auth/auth');

describe('authService', function(){
	describe('authService.verifyPassword()', function(){
		it('should return a username, access token, and refresh token upon sign in', function(done){
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					expect(response.accessToken).to.be.ok;
					expect(response.refreshToken).to.be.ok;
					expect(response.username).to.equal('Mack');
					done();
				});
		});
		it('should reject with an error in the event that the password is incorrect', function(done){
			authService.verifyPassword('Mack', 'hurgburg')
				.catch(function(err){
					expect(err).to.equal('Wrong username or password.');
					done();
				});
		});
		it('should reject with an error in the event that the username is incorrect', function(done){
			authService.verifyPassword('Mork', 'hurgusburgus')
				.catch(function(err){
					expect(err).to.equal('Wrong username or password.');
					done();
				});
		});
	});
	describe('authService.validateRequestMiddleWare() method', function(){
		it('should return a function', function(){
			expect(typeof authService.validateRequestMiddleWare()).to.equal('function');
		});
		it('should decode a valid token', function(done){
			var mockReq = {
				headers : {
					'authorization' : '',
					'x-userid' : 'Mack'
				}
			};
			var middleWare = authService.validateRequestMiddleWare();
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					mockReq.headers['authorization'] = 'Bearer ' + response.accessToken;
					middleWare(
						mockReq,
						{},
						function(){
							expect(mockReq.user).to.equal('Mack');
							done();
						});
				});
		});
		it('should reject an invalid token', function(done){
			var middleWare = authService.validateRequestMiddleWare();
			var mockReq = {
				headers : {
					'authorization' : 'Bearer hoodilydoodily',
					'x-userid' : 'Mack'
				}
			};
			var callback = function(responseObject){
				expect(responseObject.success).to.be.false;
				expect(responseObject.message).to.equal('Invalid token.');
				done();
			};
			middleWare(
				mockReq,
				{
					status : function(){
						return {
							send : callback
						}
					}
				},
				function(){}
			);
		});
		it('should reject an otherwise valid token that does not have the correct corresponding x-userid', function(done){
			var mockReq = {
				headers : {
					'authorization' : '',
					'x-userid' : 'Mork'
				}
			};
			var middleWare = authService.validateRequestMiddleWare();
			var callback = function(responseObject){
				expect(responseObject.success).to.be.false;
				expect(responseObject.message).to.equal('x-userid value does not match user claim in token.');
				done();
			};
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					mockReq.headers['authorization'] = 'Bearer ' + response.accessToken;
					middleWare(
						mockReq,
						{
							status : function(){
								return {
									send : callback
								}
							}
						},
						function(){}
					);
				});
		});
	});
	describe('authService.refreshToken() method', function(){
		it('should accept a valid refreshToken, returning an access token and the original refresh token in the response body', function(done){
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					authService.refreshToken(response.refreshToken, response.username)
						.then(function(tokens){
							expect(tokens.accessToken).to.be.ok;
							expect(tokens.refreshToken).to.equal(response.refreshToken);
							done();
						});
				});
		});
		it('should reject an invalid refreshToken, returning an error', function(done){
			authService.refreshToken('harflenarfle', 'Mack')
				.catch(function(err){
					expect(err.success).to.be.false;
					expect(err.message).to.equal('Invalid refresh token.');
					done();
				});
		});
		it('should NOT accept a valid refresh token if the decoded user name does not match the value of x-userid', function(done){
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					authService.refreshToken(response.refreshToken, 'Mork')
						.catch(function(err){
							expect(err.success).to.be.false;
							expect(err.message).to.equal('x-userid value does not match user claim in token.');
							done();
						});
				});
		});
		it('should NOT treat a token issued as an access token as a refresh token (and reject it)', function(done){
			authService.verifyPassword('Mack', 'hurgusburgus')
				.then(function(response){
					authService.refreshToken(response.accessToken, response.username)
						.catch(function(err){
							expect(err.success).to.be.false;
							expect(err.message).to.equal('Invalid refresh token.');
							done();
						});
				});
		});
	});
});