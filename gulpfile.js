const gulp = require('gulp');
const replace = require('gulp-replace');
const cleanDir = require('gulp-clean-dir');
const config = require('./gulp.config');
const iconGenerator = require('./index');
const liveServer = require("live-server");

function html() {
  return gulp.src('./src/index.html')
    .pipe(cleanDir('./dist'))
    .pipe(replace('-page_title-', config['literals']['page_title']))
    .pipe(replace('-page_heading-', config['literals']['page_heading']))
    .pipe(replace('-page_lead-', config['literals']['page_lead']))
    .pipe(replace('-no_script_txt-', config['literals']['no_script_txt']))
    .pipe(gulp.dest('./dist'))
}

function css() {
  return gulp.src('./src/style.css')
    .pipe(replace('-custom-color-1-', config['colors']['accent_color']))
    .pipe(replace('-custom-color-2-', config['colors']['secondary_color']))
    .pipe(gulp.dest('./dist'))
}

function js() {
  return gulp.src('./src/*.js')
    .pipe(replace('-copy_button_txt-', config['literals']['copy_button_txt']))
    .pipe(replace('-copy_button_success-', config['literals']['copy_button_success']))
    .pipe(replace('-download_button_txt-', config['literals']['download_button_txt']))
    .pipe(replace('-download_button_success-', config['literals']['download_button_success']))
    .pipe(replace('-no_category_heading-', config['literals']['no_category_heading']))
    .pipe(gulp.dest('./dist'))
}

function generateJSON() {
  return iconGenerator.run(config['icons']['directory'])
}

function serve() {
  return Promise.resolve(liveServer.start({root:"./dist"}))
}

exports.build = gulp.series(html, css, js, generateJSON)
exports.icons = gulp.series(generateJSON)
exports.serve = serve;