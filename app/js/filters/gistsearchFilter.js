'use strict';

angular.module('gisto.filter.gistsearch', []).filter('gistsearch', function () {
	return function (items, searchterm) {		
	
		// if the searchterm is empy from the <input> then we simply return the items
		if(searchterm === undefined) { return items; }
		if(searchterm.length < 1) { return items; }
		
		// we need to split the searchterm, because you can search for separate terms
		// splitted by space and you can also use quotes
		// like single words "fixed string of words"

		var myRegexp = /[^\s"]+|"([^"]*)"/gi;
		var searchTermsArr = [];

		do {
			//Each call to exec returns the next regex match as an array
			var match = myRegexp.exec(searchterm);
			if (match != null)
			{
				//Index 1 in the array is the captured group if it exists
				//Index 0 is the matched text, which we use if no captured group exists
				searchTermsArr.push(match[1] ? match[1] : match[0]);
			}
		} while (match != null);

		
		var filtered = [];
		
		// iterate over all searchterms, if all match, either in the filename or in the description we add that item to the results
		for (var i = 0; i < items.length; i++) {
			var cItem = items[i];			
		
			var matchesAllSearchTerms = true;
			var cDescription = "";
			var cFilename = "";
			for (var j = 0; j < searchTermsArr.length; j++) {	
				var cSearchTerm = searchTermsArr[j].toLowerCase(); 
				
				cDescription = "";
				if(items[i].description !== undefined) {
					cDescription = items[i].description + "";
					cDescription = cDescription.toLowerCase();
				}
				
				cFilename = "";
				if(items[i].filename !== undefined) {
					cFilename = items[i].filename + "";
					cFilename = cFilename.toLowerCase();
				}				
				
				if(cDescription.indexOf(cSearchTerm) < 0 && cFilename.indexOf(cSearchTerm) < 0) {
					matchesAllSearchTerms = false;
				}			
			}
			
			if(matchesAllSearchTerms) {
				filtered.push(items[i]);
			}
		}
		
		
		return filtered;;
	};
	
});