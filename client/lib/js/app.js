'use strict';
angular.module('linkFinder', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ngCsv', 'ngStorage', 'data-table', 'checklist-model', 'ui.bootstrap'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.when('/', {
			//TODO: set reloadOnSearch to be false so I can manipulate the routeParams without reloading the controller.
			templateUrl : 'dist/html/getLinks.html',
			controller : 'GetLinksController',
			reloadOnSearch : false
		});
		// .when('/somethingelse', {
		// 	templateUrl : 'somethingelse.html',
		// 	controller : 'somethingelse'
		// })
	}])
  .run();