var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg_json = require('./package.json');
var fs = require('fs');
var argv = require('yargs').argv;
var concat = require('gulp-concat-sourcemap');
var strip_log = require('gulp-strip-debug');

/**
 * @name version
 * @description Get Gisto version
 * @usage gulp version
 */
gulp.task('version', function () {
    gutil.log('Version', gutil.colors.green(pkg_json.version));
});

/**
 * @name version_bump
 * @description Change Gisto version
 * @usage gulp version_bump --to=0.2.4b
 */
gulp.task('version_bump', function () {
    var files = [
        './package.json',
        './app/package.json'
    ];
    files.forEach(function (file) {
        var content = JSON.parse(fs.readFileSync(file));
        content.version = argv.to;
        fs.writeFileSync(file, JSON.stringify(content, null, 4));
    });
});

/**
 * @name dev
 * @description Change Gisto environment to "development"
 * @usage gulp dev
 */
gulp.task('dev', function(){
    var files = [
        './app/index.html'
    ];
    var option = {
        env_dev: 'env:dev',
        env_prod: 'env:prod',
        blocking_char: '#'
    };
    files.forEach(function (file) {
        var content = fs.readFileSync(file, "utf8")
            .replace('<!-- ' + option.env_dev + ' --' + option.blocking_char + '>', '<!-- ' + option.env_dev + ' -->')
            .replace('<!-- ' + option.env_prod + ' -->', '<!-- ' + option.env_prod + ' --' + option.blocking_char + '>')
            .replace('/* ' + option.env_dev + ' *' + option.blocking_char + '/', '/* ' + option.env_dev + ' */')
            .replace('/* ' + option.env_prod + ' */', '/* ' + option.env_prod + ' *' + option.blocking_char + '/');
        fs.writeFileSync(file, content);
    });
});

/**
 * @name prod
 * @description Change Gisto environment to "production", also concatenates files and remove console logs
 * @usage gulp prod
 */
gulp.task('prod', ['concat'], function () {
    var files = [
        './app/index.html'
    ];
    var option = {
        env_dev: 'env:dev',
        env_prod: 'env:prod',
        blocking_char: '#'
    };
    files.forEach(function (file) {
        var content = fs.readFileSync(file, "utf8")
            .replace('<!-- ' + option.env_prod + ' --' + option.blocking_char + '>', '<!-- ' + option.env_prod + ' -->')
            .replace('<!-- ' + option.env_dev + ' -->', '<!-- ' + option.env_dev + ' --' + option.blocking_char + '>')
            .replace('/* ' + option.env_prod + ' *' + option.blocking_char + '/', '/* ' + option.env_prod + ' */')
            .replace('/* ' + option.env_dev + ' */', '/* ' + option.env_dev + ' *' + option.blocking_char + '/');
        fs.writeFileSync(file, content);
    });
});

/**
 * @name concat
 * @description concatenates files and remove console logs, also used by other functions here
 * @usage gulp concat
 */
gulp.task('concat', function () {
    gulp.src([
        './app/lib/jquery/*.js',
        './app/lib/angular/*.js',
        './app/lib/socket-io/*.js',
        './app/lib/angular-ui/*.js',
        './app/js/*/*.js',
        './app/js/app.js',
        './app/lib/showdown.js'
    ])
        .pipe(strip_log())
        .pipe(concat('gisto.min.js'))
        .pipe(gulp.dest('./app/js/'));
});

/**
 * @name release
 * @description Will be used for releases
 * @usage gulp release
 */
gulp.task('release', ['concat'], function () {
    // Do stuff
});

gulp.task('default', ['version'], function () {
   gutil.log('"default" task',gutil.colors.green('All run OK'))
});