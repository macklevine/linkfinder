'use strict';
angular.module('linkFinder').factory('TableOptions', [function(){
	return {
		loadingMessage: "No links fetched.",
		rowHeight: 50,
		headerHeight: 50,
		footerHeight: false,
		scrollbarV: false,
		selectable: false,
		columns: $scope.selectedFields,
		columnMode: 'force'
	};
}]);