const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const gzip = require('gulp-gzip');
const rev = require('gulp-rev');
const modify = require('modify-filename');
const through = require('through2');
const uglify = require('gulp-uglify');
const image = require('gulp-image');
var args = require('yargs').argv;
var currentRevision = args.hash;


//path di destinazione finale degli assets
const buildDestination = './../../public';
const buildDestinationDev = './../../../../public';

//path dove appoggiare file temporanei prima di essere spostati nella directory principale
const tempBuildDestination = './tempBuild';

//cancella tutti i file contenuti nella cartella di destinazione finale buildDestination
gulp.task('cleanPublicAssets', () => {
    return del([
        buildDestination + '/assets'
    ], {force: true});
});

//convert da sass a css, minify e copyCss
gulp.task('operationSass', function () {
    return gulp.src([
        './sass/**/*.sass',
        './sass/**/*.scss',
        './css/**/*.css'
    ])
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest(tempBuildDestination + '/assets/css'));
});

//uglify e copyJs da js/ a tempBuild/assets/js
gulp.task('operationJs', function () {
    return gulp.src('./js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(tempBuildDestination + '/assets/js'));
});

//copyImg da img/ a tempBuild/assets/img
gulp.task('operationImg', function () {
    return gulp.src('./img/**/*')
        .pipe(image())
        .pipe(gulp.dest(tempBuildDestination + '/assets/img'));
});

//prende tutti i file contenuti nella cartella tempBuildDestination gli assegna un hash statico, crea il file manifest.json e copia i file nella
// cartella di destinazione buildDestination
gulp.task('revHash', function () {
    return gulp.src(
        [
            tempBuildDestination + '/assets/css/*',
            tempBuildDestination + '/assets/js/*',
            tempBuildDestination + '/assets/img/*'
        ],
        {base: tempBuildDestination}
    )
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

// cancella la directory temporanea tempBuild
gulp.task('cleanTempBuild', () => {
    return del([
        tempBuildDestination
    ]);
});

//gz file js in buildDestination/assets/js'
gulp.task('gzJs', function () {
    return gulp.src(buildDestination + '/assets/js/**/*.js')
        .pipe(gzip())
        .pipe(gulp.dest(buildDestination + '/assets/js'));
});

//gz file css in buildDestination/assets/css'
gulp.task('gzCss', function () {
    return gulp.src(buildDestination + '/assets/css/**/*.css')
        .pipe(gzip())
        .pipe(gulp.dest(buildDestination + '/assets/css'));
});

gulp.task('watch', () => {
    gulp.watch([
        './sass/**/*.sass',
        './sass/**/*.scss',
        './css/**/*.css',
        './js/**/*.js'
    ], (done) => {
        gulp.series(['cleanPublicAssets', 'operationSass', 'operationJs', 'operationImg', 'revHash', 'cleanTempBuild', 'gzJs', 'gzCss'])(done);
    });
});

//Eseguire il comando            gulp --hash esempio                per eseguire i file in formato hash
gulp.task('default', gulp.series(['cleanPublicAssets', 'operationSass', 'operationJs', 'operationImg', 'revHash', 'cleanTempBuild', 'gzJs', 'gzCss']));



