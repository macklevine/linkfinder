'use strict';

angular.module('linkFinder').factory('LoginModalTemplate', ['$templateCache',
	function($templateCache){
		var modalHtml = '<div class="modal-header">' +
        	'<h3 class="modal-title">Login</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        	'Please login. ' +
        '</div>' +
        '<div>' +
        	'<label>  Username: </label><input ng-model="username" type="text"></input>' +
        '</div>' +
        '<div>' +
        	'<label>  Password: </label><input ng-model="password" type="password"></input>' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button class="btn btn-success" type="button" ng-click="ok()">Login</button>' +
            '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
        '</div>';
		$templateCache.put('loginModalTemplate.html', modalHtml);
		return {};
	}]
);