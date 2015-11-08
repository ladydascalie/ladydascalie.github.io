var gulp         = require('gulp');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();


var config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    publicDir: './public',
    bowerDir: './bower_components'
};

// Default css compilation task
gulp.task('css', function() {
    return gulp.src('./css/app.scss')
    .pipe(sass({
        includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
    .pipe(gulp.dest(config.publicDir + '/css'));
});

// Default prefixer
gulp.task('prefix', function () {
    return gulp.src('public/css/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('.'));
});

// Default bootstrap javascript task
gulp.task('js', function() {
  return gulp.src([
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.bootstrapDir + '/assets/javascripts/bootstrap.min.js'])
    .pipe(uglify())
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest(config.publicDir + '/js/vendor/'));
});

// Default font compilation task
gulp.task('fonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
});

// Static Server + watching scss/html files
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        },
      // startPath: "/public"
    });
    gulp.watch("css/*.scss", ['css', 'prefix']);
    gulp.watch(["public/*.html", "public/css/app.css"]).on('change', browserSync.reload);
});

gulp.task('default', ['css', 'prefix', 'fonts', 'js','browser-sync']);
