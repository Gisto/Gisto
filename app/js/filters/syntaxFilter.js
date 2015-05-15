'use strict';

angular.module('gisto.filter.codeLanguage', []).filter('codeLanguage',['syntaxRepository',function (syntaxRepository) {

        var languages = syntaxRepository.syntaxes;

        return function (input) {
            return languages.hasOwnProperty(input) ? languages[input] : 'text';
        };
    }]);