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
    'app/lib/jquery/dist/jquery.min.js',
    'app/lib/socket.io-client/socket.io.js',
    'app/lib/angular/angular.min.js',
    'app/lib/angular-bugsnag/dist/angular-bugsnag.min.js',
    'app/lib/angular-route/angular-route.min.js',
    'app/lib/angular-animate/angular-animate.js',
    'app/lib/angular-sanitize/angular-sanitize.js',
    'app/lib/angular-ui-utils/ui-utils.min.js',
    'app/lib/angular-socket-io/socket.min.js',
    'app/lib/showdown/compressed/Showdown.js',
    'app/lib/angulartics/dist/angulartics.min.js',
    'app/lib/angulartics/dist/angulartics-ga.min.js',
    'app/lib/emmet/emmet.min.js',
    'app/lib/angular-hotkeys/build/hotkeys.min.js',
    'app/js/app.js',
    'app/js/**/*.js',
    '!app/js/gisto.min.js'
];

// Gisto CSS files for "concat" and "dist"
var gisto_css_files = [
    'app/lib/normalize.css/normalize.css',
    'app/lib/font-awesome/css/font-awesome.min.css',
    'app/lib/angular-hotkeys/build/hotkeys.min.css',
    'app/css/app.css',
    'app/css/markdown.css',
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
 * Use: gulp version_bump --to=0.2.4b
 */
gulp.task('version_bump', function () {
    var files = ['./package.json', './bower.json', './app/package.json'],
        oldVersion = pkg_json.version;
    files.forEach(function (file) {
        var content = JSON.parse(fs.readFileSync(file));
        content.version = argv.to;
        fs.writeFileSync(file, JSON.stringify(content, null, 4));
    });
    var appjs = fs.readFileSync('./app/js/app.js','utf8')
        .toString()
        .replace(".appVersion('" + oldVersion + "')",".appVersion('" + argv.to + "')");
    fs.writeFileSync('./app/js/app.js',appjs);
    gutil.log('Version changed from: ', gutil.colors.green(oldVersion), ' to: ', gutil.colors.green(argv.to));
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
    // bugSnag to production
    var appjs = fs.readFileSync('./app/js/app.js','utf8')
        .toString()
        .replace(".releaseStage('development')",".releaseStage('production')");
    fs.writeFileSync('./app/js/app.js',appjs);
    gutil.log('Set BugSnag ' + gutil.colors.green('releaseStage') + ' to:', gutil.colors.green('production'));
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
        '!app/lib/**',
        '!app/css/**',
        '!app/config.json.sample'
    ])
        .pipe(gulp.dest('./dist/'));
    gulp.src([
        'app/js/gisto.min.js'
    ])
        .pipe(gulp.dest('./dist/js/'));
    gulp.src([
        'app/lib/ace-builds/src-min-noconflict/**'
    ])
        .pipe(gulp.dest('./dist/lib/ace-builds/src-min-noconflict'));
    gulp.src([
        'app/css/gisto.css',
        'app/css/animation.css'
    ])
        .pipe(gulp.dest('./dist/css/'));
    gulp.src([
        'app/lib/font-awesome/fonts/**'
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
