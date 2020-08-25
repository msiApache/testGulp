const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const gzip = require('gulp-gzip');
const rev = require('gulp-rev');
const modify = require('modify-filename')
const through = require('through2')
var args = require('yargs').argv


const buildDestination = './../../public';
const tempBuildDestination = './tempBuild';

var currentRevision = args.hash;
gulp.task('clean', () => {
    //todo da aggiungere eliminazione degli altri assets
    return del([
        tempBuildDestination
    ]) ;
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(tempBuildDestination + '/assets/css'));
});

gulp.task('watch', () => {
    gulp.watch('./sass/**/*.scss', (done) => {
        gulp.series(['sass'])(done);
    });
});


gulp.task('copyImg', function () {
    return gulp.src('./img/**/*')
        .pipe(gulp.dest(buildDestination + '/assets/img'));
});

gulp.task('copyCss', function () {
    return gulp.src('./css/**/*.css')
        .pipe(gulp.dest(tempBuildDestination + '/assets/css'));
});

gulp.task('copyJs', function () {
    return gulp.src('./js/**/*.js')
        .pipe(gulp.dest(tempBuildDestination + '/assets/js'));
});

gulp.task('compressCss', function () {
    return gulp.src(buildDestination + '/assets/css/**/*.css')
        .pipe(gzip())
        .pipe(gulp.dest(buildDestination + '/assets/css'));
});

gulp.task('compressJs', function () {
    return gulp.src(buildDestination + '/assets/js/**/*.js')
        .pipe(gzip())
        .pipe(gulp.dest(buildDestination + '/assets/js'));
});

gulp.task('rev', function () {
    return gulp.src([tempBuildDestination + '/assets/css/*.css', tempBuildDestination + '/assets/js/*.js'], {base: tempBuildDestination})
        .pipe(rev())
        .pipe(through.obj(function (file, enc, cb) {
            file.path = modify(file.revOrigPath, function (name, ext) {
                return name + '-' + currentRevision + ext;
            });
            cb(null, file);
        }))
        .pipe(gulp.dest(buildDestination))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./manifest'))
});

//Eseguire il comando            gulp --hash esempio                per eseguire i file in formato hash
gulp.task('default', gulp.series(['clean', 'sass', 'copyCss', 'copyImg', 'copyJs','rev','clean','compressCss','compressJs']));
