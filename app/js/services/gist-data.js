'use strict';

angular.module('gisto.service.gistData', [], function ($provide) {
    $provide.factory('gistData', function () {
        var dataService = {
            list: [],
            getGistById: function (id) {
                for (var gist in dataService.list) {
                    gist = dataService.list[gist];
                    if (gist.id === id) {
                        return gist;
                    }
                }
            }
        };
        return dataService;
    });
});