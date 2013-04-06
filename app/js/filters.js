'use strict';

/* Filters */

angular.module('myApp.filters', []).
        filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])
    .filter('publicOrPrivet', function() {
    return function(input) {
        return input ? 'public' : 'secret';
    };
    }).filter('codeLanguage', function() {

        var languages = {
            "C#":"csharp",
            "C++":"c_cpp",
            Clojure:"clojure",
            CoffeeScript:"coffee",
            ColdFusion:"coldfusion",
            CSS:"css",
            Groovy:"groovy",
            Haxe:"haxe",
            HTML:"html",
            Java:"java",
            JavaScript:"javascript",
            JSON:"json",
            Lua:"lua",
            Markdown:"markdown",
            OCaml:"ocaml",
            Perl:"perl",
            PHP:"php",
            PowerShell:"powershell",
            Python:"python",
            Ruby:"ruby",
            Scala:"scala",
            SCSS:"scss",
            SQL:"sql",
            TeX:"latex",
            Textile:"textile",
            XML:"xml"
        };

        return function(input) {
            return languages.hasOwnProperty(input) ? languages[input] : input;
        };
    });

