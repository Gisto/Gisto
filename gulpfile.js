var gulp = require('gulp');
var pkg_json = require('./package.json');
var fs = require('fs');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var strip_log = require('gulp-strip-debug');

gulp.task('version', function () {
    console.log('Version', pkg_json.version);
});

gulp.task('version_bump', function () {
    var files = ['./package.json', './app/package.json'];
    files.forEach(function (file) {
        var content = JSON.parse(fs.readFileSync(file));
        content.version = argv.to;
        fs.writeFileSync(file, JSON.stringify(content, null, 4));
    });
});

gulp.task('dev', function () {
    // Do stuff
});

gulp.task('concat', function () {
    // Do stuff
});

gulp.task('release', function () {
    // Do stuff
});

gulp.task('default', function () {
    // Do default staff
});