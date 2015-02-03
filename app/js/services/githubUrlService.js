'use strict';

angular.module('gisto.service.githubUrlBuilder', [], function ($provide) {
    $provide.factory('githubUrlBuilderService', function (ghAPI, $filter, $rootScope, $routeParams) {

        var githubFileNameFilter = $filter('githubFileName');
        var publicGithubUrl = 'https://gist.github.com/';
        var baseUrl = publicGithubUrl;

        $rootScope.$watch('enterpriseMode', function(enterpriseMode, oldMode) {
            if (enterpriseMode) {
                var endpoint = ghAPI.getEndpoint();
                console.log(endpoint);
                if (endpoint.hasOwnProperty('api_url')) {
                    baseUrl = endpoint.api_url.replace('/api/v3', '/gist/');
                    console.log(baseUrl);
                }
            } else {
                baseUrl = publicGithubUrl;
            }
        });

        var service = {
            buildFileLink: function(gist, file) {
                return baseUrl + gist.single.owner.login + '/' + gist.single.id + '/#file-' + githubFileNameFilter(file.filename);
            },
            buildGistLink: function(gist) {
                return baseUrl + gist.owner.login + '/' + gist.id +'.js';
            },
            buildHistoryLink: function(gist, file) {
                console.warn(gist);
                var url = baseUrl + gist.owner.login + '/' + gist.id + '/' + $routeParams.gistRevisionId;
                if (file) {
                    url +='/#file-' + githubFileNameFilter(file.filename);
                }
                return url;
            },
            buildDownloadLink: function(gist) {
                return baseUrl + gist.owner.login + '/' + gist.id + '/download';
            }

        };

        return service;
    });
});