/* Filters */

'use strict';

angular.module('myApp.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]).filter('markDown', function () {
        return function (input) {
            var converter = new Showdown.converter();
            var html = converter.makeHtml(input);
            return html;
        };
    })
    .filter('publicOrPrivet',function () {
        return function (input) {
            return input ? 'unlock' : 'lock';
        };
    }).filter('codeLanguage',function () {

        var languages = {
            null: "text",
            ApacheConf: "text",
            "C#": "csharp",
            "C++": "c_cpp",
            Clojure: "clojure",
            CoffeeScript: "coffee",
            ColdFusion: "coldfusion",
            CSS: "css",
            Groovy: "groovy",
            Haxe: "haxe",
            HTML: "html",
            Java: "java",
            JavaScript: "javascript",
            JSON: "json",
            Lua: "lua",
            Markdown: "markdown",
            OCaml: "ocaml",
            Perl: "perl",
            PHP: "php",
            PowerShell: "powershell",
            Python: "python",
            Ruby: "ruby",
            Scala: "scala",
            SCSS: "scss",
            Shell: "sh",
            SQL: "sql",
            TeX: "latex",
            Textile: "textile",
            XML: "xml"
        };

        return function (input) {
            return languages.hasOwnProperty(input) ? languages[input] : input;
        };
    }).filter('removeTagSymbol',function () {
        return function (input) {
            return input.substring(1, input.length);
        };
    }).filter('removeTags',function () {
        return function (input) {
            return input ? input.replace(/(#[A-Za-z0-9\-\_]+)/g, '') : input;
        };
    }).filter('truncate', function () {
        return function (text, length, end) {

            if (!text) {
                return '';
            }
            if (isNaN(length)) {
                length = 10;
            }
            if (end === undefined) {
                end = "...";
            }
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length - end.length) + end;
            }

        };
    });