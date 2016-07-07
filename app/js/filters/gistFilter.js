'use strict';

angular.module('gisto.filter.gist', []).filter('gistFilter', function (appSettings, $filter) {
        return function(arr, searchString) {
            if (!searchString) {
                return arr;
            }

            // uses the Case Sensitive Wrapabble search
            if (appSettings.get('gist_cs_wrap_search')) {

                var pattern = '';
                for (var i = 0; i < searchString.length; i++) {
                    pattern += searchString[i] + '.*';
                }
                
                var result = [];
                angular.forEach(arr, function(item) {

                    if (item.description.match(pattern)) {
                        result.push(item);
                    }
                });

                return result;
            } else { 
                // uses angular default deep search over all gists list fields
                return $filter('filter')(arr, searchString);
            }
        };
    });