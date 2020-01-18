const gulp = require("gulp");
const babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require("gulp-concat");
var cssMin = require("gulp-css");
const htmlmin = require('gulp-htmlmin');
var rename = require("gulp-rename");

gulp.task('views', async function(){
    gulp.src([`./0/views/*.ejs`])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function (path) {
        path.dirname = "";
        path.basename;
        path.extname = ".ejs";
    }))
    .pipe(gulp.dest('./views'));
    gulp.src([`./0/views/partials/*.ejs`])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function (path) {
        path.dirname = "partials";
        path.basename;
        path.extname = ".ejs";
    }))
    .pipe(gulp.dest('./views'));

    gulp.src([`./0/**/*.html`])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function (path) {
        path.dirname = "partials";
        path.basename;
        path.extname = ".html";
    }))
    .pipe(gulp.dest('./views'));
});
gulp.task('css', ()=>{
    return gulp.src(`./0/css/*.css`)
    .pipe(rename(function (path) {
        path.dirname = "stylesheets";
        path.basename = path.basename+="-min";;
        path.extname = ".css";
        }))
    .pipe(cssMin())
    .pipe(gulp.dest('./public/'));
}); 
gulp.task('js',()=>{
    return gulp.src('./0/js/*.js')
    .pipe(babel({ presets:['@babel/env']}))
    .pipe(rename(function (path) {
        path.dirname = "javascripts";
        path.basename = path.basename+="-min";;
        path.extname = ".js";
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/'));

});
gulp.task('admins', async function(){
    gulp.src([`./admins/views/*.ejs`])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename(function (path) {
        path.dirname = "";
        path.basename;
        path.extname = ".ejs";
    }))
    .pipe(gulp.dest('./views'));


    gulp.src('./admins/js/*.js')
    .pipe(rename(function (path) {
        path.dirname = "javascripts";
        path.basename = path.basename+="-min";;
        path.extname = ".js";
    }))
    .pipe(gulp.dest('./public/'));

     gulp.src(`./admins/css/*.css`)
    .pipe(rename(function (path) {
        path.dirname = "stylesheets";
        path.basename = path.basename+="-min";;
        path.extname = ".css";
        }))
    .pipe(cssMin())
    .pipe(gulp.dest('./public/'));
  

});




    gulp.task("init",gulp.series("views","css","js","admins"));

    
    gulp.task('watch',function(){
        gulp.watch('./admins/**/*.*', gulp.series('admins'))
        gulp.watch('./0/**/*.html', gulp.series('views'))
        gulp.watch('./0/**/*.ejs', gulp.series('views'))
        gulp.watch('./0/**/*.css', gulp.series('css'))
        gulp.watch('./0/**/*.js', gulp.series('js'))
    })
    gulp.task('default',gulp.series("init","watch"));