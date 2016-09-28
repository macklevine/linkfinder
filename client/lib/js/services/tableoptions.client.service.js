'use strict';
angular.module('linkFinder').factory('TableOptions', [function(){
	var getOptions = function(selectedFields){
		return {
			loadingMessage: "No links fetched.",
			rowHeight: 50,
			headerHeight: 50,
			footerHeight: false,
			scrollbarV: false,
			selectable: false,
			columns: selectedFields,
			columnMode: 'force'
		};
	}
	return {
		getOptions : getOptions
	};
}]);