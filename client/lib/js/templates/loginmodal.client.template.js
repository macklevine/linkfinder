'use strict';

angular.module('linkFinder').factory('LoginModalTemplate', ['$templateCache',
	function($templateCache){
		var modalHtml = '<div class="modal-header">' +
        	'<h3 class="modal-title">Login</h3>' +
        '</div>' +
        '<div class="modal-body login-modal-body">' +
            '<div class="row">' +
                '<div class="col-xs-6">' +
                	'<label>  Username: </label><input class="form-control" ng-model="username" type="text"></input>' +
                '</div>' +
                '<div class="col-xs-6">' +
                    '<div ng-show="showSuccessMessage" class="alert-success login-success" uib-alert>' +
                        'Login Successful!' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="row" style="padding-top:10px">' +
                '<div class="col-xs-6">' +
                	'<label>  Password: </label><input class="form-control" ng-model="password" type="password"></input>' +
                '</div>' +
                '<div class="col-xs-6">' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button class="btn btn-success" type="button" ng-click="ok()">Login</button>' +
            '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
        '</div>';
		$templateCache.put('loginModalTemplate.html', modalHtml);
		return {};
	}]
);