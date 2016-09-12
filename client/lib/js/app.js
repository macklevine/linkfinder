angular.module('linkFinder', ['ngRoute'])
	.config(function($routeProvider){
		$routeProvider.when('/', {
			templateUrl : 'dist/html/getLinks.html',
			controller : 'GetLinksController'
		});
		// .when('/somethingelse', {
		// 	templateUrl : 'somethingelse.html',
		// 	controller : 'somethingelse'
		// })
	})
  .run();