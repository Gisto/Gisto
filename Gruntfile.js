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
                    //'app/lib/ace/*.js',
                    //'app/lib/angular/angular.js',
                    'app/lib/angular-ui/ui-utils.min.js',
                    'app/js/*.js',
                    'app/lib/showdown.js'
                ],

                // Destination for concatenated/minified JavaScript
                dest: 'app/js/<%= pkg.name %>.min.js',

                // Destination for sourcemap of minified JavaScript
                destMap: 'all.js.map'
            }
        },
        watch: {
            scripts: {
                files: '**/*.js',
                tasks: ['jsmin-sourcemap'],
                options: {
                    interrupt: true
                }
            }
        },
        dev_prod_switch: {
            options: {
                environment: 'dev' // 'prod' or 'dev'
            },
            all: {
                files: {
                    'app/index.html': 'app/index.html' // source: destination
                }
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dev-prod-switch');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.registerTask('default', ['jsmin-sourcemap', 'removelogging', 'dev_prod_switch']);

};
