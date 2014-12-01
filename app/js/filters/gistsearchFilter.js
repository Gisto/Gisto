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
			var atLeastOneFileMatchesTerms = false;
			for (var j = 0; j < searchTermsArr.length; j++) {	
				var cSearchTerm = searchTermsArr[j].toLowerCase(); 
				
				if(!descriptionMatchesTerm(items[i], cSearchTerm) && !atLeastOneFileNameMatchesTerm(items[i], cSearchTerm)) {
					matchesAllSearchTerms = false;
					break;
				}			
			}
			
			if(matchesAllSearchTerms) {
				filtered.push(items[i]);
			}
		}
		
		
		return filtered;;
	};
	
	function descriptionMatchesTerm(item, term) {
		if(item.description === undefined) { return false; }

		var cDescription = item.description + "";
		cDescription = cDescription.toLowerCase();		
		if (cDescription.indexOf(term) < 0) {
			return false;
		} else {
			return true;		
		}	
	}	
	
	function atLeastOneFileNameMatchesTerm(item, term) {
		if(item.filesCount == 0) { return false; }

		var cFilename = "";		
		for (var i = 0; i < item.filesCount; i++) {	
			cFilename = Object.keys(item.files)[i];
			cFilename = cFilename.toLowerCase();						
			if(cFilename.indexOf(term) >= 0) {
				return true;
			}							
		}	
		
		return false;
	}
});