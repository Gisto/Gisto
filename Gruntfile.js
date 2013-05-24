module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'jshint': {
            all: [
                'app/js/main.js',
                'app/js/app.js',
                'app/js/services.js',
                'app/js/controllers.js',
                'app/js/filters.js',
                'app/js/directives.js'
            ],
            options: {
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "browser": true,
                "node": true,
                "devel": true,
                "strict": true,
                "globals": {
                    "jQuery": true,
                    "$": true,
                    "angular": true,
                    "ace": true,
                    "Showdown": true,
                    "clipboard": true
                }
            }
        },
        'jsmin-sourcemap': {
            all: {
                banner: '/*!\n<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                src: [
                    'app/lib/jquery/jquery-2.0.0.js',
                    'app/js/main.js',
                    //'app/lib/ace/*.js',
                    'app/lib/angular/angular.js',
                    'app/lib/angular-ui/angular-ui.js',
                    'app/js/app.js',
                    'app/js/services.js',
                    'app/js/controllers.js',
                    'app/js/filters.js',
                    'app/js/directives.js',
                    'app/lib/showdown.js'
                ],

                // Destination for concatenated/minified JavaScript
                dest: 'app/js/<%= pkg.name %>.min.js',

                // Destination for sourcemap of minified JavaScript
                destMap: 'all.js.map'
            }
        },
        removelogging: {
            dist: {
                src: 'app/js/<%= pkg.name %>.min.js',
                dest: 'app/js/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsmin-sourcemap');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.registerTask('default', ['jsmin-sourcemap', 'removelogging'/*, 'jshint'*/]);

};
