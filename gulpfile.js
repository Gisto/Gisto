var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg_json = require('./package.json');
var fs = require('fs');
var argv = require('yargs').argv;
var concat = require('gulp-concat-sourcemap');
var strip_log = require('gulp-strip-debug');

// Options to switch environment (dev/prod)
var env_option = {
    env_dev: 'env:dev',
    env_prod: 'env:prod',
    blocking_char: '#'
};

// Gisto JS files for "concat" and "dist"
var gisto_js_files = [
    'node_modules/bugsnag-js/src/bugsnag.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/socket.io-client/socket.io.js',
    'node_modules/angular/angular.js',
    'node_modules/angular-bugsnag/dist/angular-bugsnag.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-sanitize/angular-sanitize.js',
    'node_modules/angular-ui-utils/modules/utils.js',
    'node_modules/angular-ui-utils/modules/alias/alias.js',
    'node_modules/angular-ui-utils/modules/highlight/highlight.js',
    'node_modules/angular-ui-utils/modules/indeterminate/indeterminate.js',
    'node_modules/angular-ui-utils/modules/keypress/keypress.js',
    'node_modules/angular-ui-utils/modules/route/route.js',
    'node_modules/angular-ui-utils/modules/showhide/showhide.js',
    'node_modules/angular-ui-utils/modules/validate/validate.js',
    'node_modules/angular-ui-utils/modules/event/event.js',
    'node_modules/angular-ui-utils/modules/ie-shiv/ie-shiv.js',
    'node_modules/angular-ui-utils/modules/inflector/inflector.js',
    'node_modules/angular-ui-utils/modules/mask/mask.js',
    'node_modules/angular-ui-utils/modules/scroll/scroll.js',
    'node_modules/angular-ui-utils/modules/scroll/scroll-jqlite.js',
    'node_modules/angular-ui-utils/modules/unique/unique.js',
    'node_modules/angular-ui-utils/modules/format/format.js',
    'node_modules/angular-ui-utils/modules/include/include.js',
    'node_modules/angular-ui-utils/modules/jq/jq.js',
    'node_modules/angular-ui-utils/modules/reset/reset.js',
    'node_modules/angular-ui-utils/modules/scrollfix/scrollfix.js',
    'node_modules/angular-socket-io/socket.min.js',
    'node_modules/angulartics/dist/angulartics.min.js',
    'node_modules/angulartics/dist/angulartics-ga.min.js',
    'node_modules/angular-hotkeys/build/hotkeys.min.js',
    'node_modules/marked/lib/marked.js',
    'node_modules/angular-marked/angular-marked.min.js',
    'node_modules/ui-select/dist/select.js',
    'node_modules/emmet/emmet.js',
    'node_modules/js-beautify/js/lib/beautify.js',
    'node_modules/js-beautify/js/lib/beautify-css.js',
    'node_modules/js-beautify/js/lib/beautify-html.js',
    'app/js/app.js',
    'app/js/**/*.js',
    '!app/js/gisto.min.js'
];

// Gisto CSS files for "concat" and "dist"
var gisto_css_files = [
    'node_modules/normalize.css/normalize.css',
    'node_modules/font-awesome/css/font-awesome.css',
    'node_modules/angular-hotkeys/build/hotkeys.min.css',
    'node_modules/ui-select/dist/select.min.css',
    'node_modules/selectize/dist/css/selectize.default.css',
    'app/css/*.css',
    '!app/css/animation.css',
    '!app/css/gisto.css'
];

/**
 * version
 *
 * Get Gisto version
 * Use: gulp version
 */
gulp.task('version', function () {
    gutil.log('Version', gutil.colors.green(pkg_json.version));
});

/**
 * version_bump
 *
 * Change Gisto version
 * Use: gulp version_bump --to=0.2.4b --bugsnag_api_key=[API KEY]
 */
gulp.task('version_bump', function () {
    var files = ['./package.json', './app/package.json'],
        oldVersion = pkg_json.version;
    files.forEach(function (file) {
        var content = JSON.parse(fs.readFileSync(file));
        content.version = argv.to;
        fs.writeFileSync(file, JSON.stringify(content, null, 4));
    });
    var appjs = fs.readFileSync('./app/js/app.js','utf8')
        .toString()
        .replace(".appVersion('" + oldVersion + "')",".appVersion('" + argv.to + "')")
        .replace(".apiKey('[API_KEY]')",".apiKey('" + argv.bugsnag_api_key + "')")
        .replace(".releaseStage('development')",".releaseStage('production')");
    fs.writeFileSync('./app/js/app.js',appjs);
    gutil.log('Version changed from: ', gutil.colors.green(oldVersion), ' to: ', gutil.colors.green(argv.to));
    gutil.log('Set BugSnag ' + gutil.colors.green('releaseStage') + ' to:', gutil.colors.green('production'));
});

/**
 * dev
 *
 * Change Gisto environment to "development"
 * Use: gulp dev
 */
gulp.task('dev', function () {
    var files = ['./app/index.html'];
    files.forEach(function (file) {
        var content = fs.readFileSync(file, "utf8")
            .replace(new RegExp("<\!-- " + env_option.env_dev + " --" + env_option.blocking_char + ">","gi"), '<!-- ' + env_option.env_dev + ' -->')
            .replace(new RegExp("<\!-- " + env_option.env_prod + " -->","gi"), '<!-- ' + env_option.env_prod + ' --' + env_option.blocking_char + '>')
            .replace(new RegExp("\/\* " + env_option.env_dev + " \*" + env_option.blocking_char + '/',"gi"), '/* ' + env_option.env_dev + ' */')
            .replace(new RegExp("\/\* " + env_option.env_prod + " \*\/","gi"), '/* ' + env_option.env_prod + ' *' + env_option.blocking_char + '/');
        fs.writeFileSync(file, content);
    });
    // Toggle "toolbar"
    var file = './app/package.json';
    var content = JSON.parse(fs.readFileSync(file));
    content.window.toolbar = true;
    fs.writeFileSync(file, JSON.stringify(content, null, 4));
    // bugSnag to to development
    var appjs = fs.readFileSync('./app/js/app.js','utf8')
        .toString()
        .replace(".releaseStage('production')",".releaseStage('development')");
    fs.writeFileSync('./app/js/app.js',appjs);
    gutil.log('Set BugSnag ' + gutil.colors.green('releaseStage') + ' to:', gutil.colors.green('development'));
});

/**
 * prod
 *
 * Change Gisto environment to "production", also concatenates files and remove console logs
 * Use: gulp prod
 */
gulp.task('prod', ['concat_js','concat_css'], function () {
    var files = ['./app/index.html'];
    files.forEach(function (file) {
        var content = fs.readFileSync(file, "utf8")
            .replace(new RegExp("<\!-- " + env_option.env_prod + " --" + env_option.blocking_char + ">","gi"), '<!-- ' + env_option.env_prod + ' -->')
            .replace(new RegExp("<\!-- " + env_option.env_dev + " -->","gi"), '<!-- ' + env_option.env_dev + ' --' + env_option.blocking_char + '>')
            .replace(new RegExp("\/\* " + env_option.env_prod + " \*" + env_option.blocking_char + '/',"gi"), '/* ' + env_option.env_prod + ' */')
            .replace(new RegExp("\/\* " + env_option.env_dev + " \*\/","gi"), '/* ' + env_option.env_dev + ' *' + env_option.blocking_char + '/');
        fs.writeFileSync(file, content);
    });
    // Toggle "toolbar"
    var file = './app/package.json';
    var content = JSON.parse(fs.readFileSync(file));
    content.window.toolbar = false;
    fs.writeFileSync(file, JSON.stringify(content, null, 4));
});

/**
 * concat
 *
 * concatenates files and remove console logs, also used by other functions here
 * Use: gulp concat
 */
gulp.task('concat_js', function () {
    var js = gulp.src(gisto_js_files)
        .pipe(strip_log())
        .pipe(concat('gisto.min.js'))
        .pipe(gulp.dest('./app/js/'));
	return js;
});
/**
 * concat
 *
 * concatenates files and remove console logs, also used by other functions here
 * Use: gulp concat
 */
gulp.task('concat_css', function () {
    var css = gulp.src(gisto_css_files)
        .pipe(concat('gisto.css'))
        .pipe(gulp.dest('./app/css/'));
	return css;
});

gulp.task('dist', ['prod'], function () {
    gulp.src([
        'app/**',
        '!app/js/**',
        '!app/css/**',
        '!app/config.json.sample'
    ])
        .pipe(gulp.dest('./dist/'));
    gulp.src([
        'app/js/gisto.min.js'
    ])
        .pipe(gulp.dest('./dist/js/'));
    gulp.src([
        'node_modules/ace-builds/src-min-noconflict/**'
    ])
        .pipe(gulp.dest('./dist/node_modules/ace-builds/src-min-noconflict'));
    gulp.src([
        'node_modules/bugsnag-js/src/bugsnag.js'
    ])
        .pipe(gulp.dest('./dist/node_modules/bugsnag-js/src/'));
    gulp.src([
        'app/css/gisto.css',
        'app/css/animation.css'
    ])
        .pipe(gulp.dest('./dist/css/'));
    gulp.src([
        'node_modules/font-awesome/fonts/**'
    ])
        .pipe(gulp.dest('./dist/fonts/'));
});

/**
 * release
 *
 * Will be used for releases
 * Use: gulp release
 */
gulp.task('release', ['concat_js','concat_css'], function () {
    // Do stuff
});

// Default task
gulp.task('default', ['version', 'dev']);
