'use strict';

angular.module('linkFinder').factory('ModalTemplate', ['$templateCache',
	function($templateCache){
		var modalHtml = '<div class="modal-header">' +
        	'<h3 class="modal-title">Download CSV</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        	'The options you selected yielded too many backlinks (a total of <strong>{{data.length}}</strong>) to render in the browser ' + 
        	'as a table. Do you want to download them as a .csv instead?' +
        '</div>' +
        '<div class="modal-footer">' +
            '<button class="btn btn-success" csv-header="csvHeaders" csv-column-order="csvColumns" type="button" ng-csv="data" ng-filename="backlinks.csv" ng-click="ok()">Download .csv</button>' +
            '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
        '</div>';
		$templateCache.put('modalTemplate.html', modalHtml);
		return {};
	}]);