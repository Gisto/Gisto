/* Filters */

'use strict';

angular.module('gisto.filters', []).
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
            "ABAP": "abap",
            "ActionScript": "actionscript",
            "Ada": "ada",
            "ASP": "vbscript",
            "ApacheConf":"text",
            "Assembly": "assembly_x86",
            "AutoHotkey": "autohotkey",
            "Batchfile": "batchfile",
            "C": "c_cpp",
            "C#": "csharp",
            "C++": "c_cpp",
            "Clojure": "clojure",
            "CoffeeScript": "coffee",
            "ColdFusion": "coldfusion",
            "Common Lisp": "lisp",
            "CSS": "css",
            "D": "d ",
            "Dart": "dart",
            "Diff": "diff",
            "DOT": "dot",
            "Erlang": "erlang",
            "Forth": "forth",
            "Go": "golang",
            "Groovy": "groovy",
            "Haml": "haml",
            "Haskell": "haskell",
            "Haxe": "haxe",
            "HTML": "html",
            "HTML+Django": "html",
            "HTML+ERB": "html",
            "HTML+PHP": "html",
            "INI": "ini",
            "Java": "java",
            "Java Server Pages": "jsp",
            "JavaScript": "javascript",
            "JSON": "json",
            "Julia": "julia",
            "Less": "less",
            "LiveScript": "livescript",
            "Lua": "lua",
            "Makefile": "makefile",
            "Markdown": "markdown",
            "Matlab": "matlab ",
            "Nginx": "json ",
            "Objective-C": "objectivec",
            "OCaml": "ocaml",
            "Perl": "perl",
            "PHP": "php",
            "PowerShell": "powershell",
            "Prolog": "prolog",
            "Python": "python",
            "R": "r",
            "RHTML": "rhtml",
            "Ruby": "ruby",
            "Rust": "rust",
            "Sass": "sass",
            "Scala": "scala",
            "Scheme": "scheme",
            "SCSS": "scss",
            "Shell": "sh",
            "SQL": "sql",
            "Tcl": "tcl",
            "TeX": "tex",
            "Text": "text",
            "Textile": "textile",
            "TOML": "toml",
            "Twig": "twig",
            "TypeScript": "typescript",
            "XML": "xml",
            "XQuery": "xquery",
            "YAML": "yaml"
        };

        return function (input) {
            return languages.hasOwnProperty(input) ? languages[input] : 'text';
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