'use strict';

/*** Variables ***/
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browsersync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var cssnano = require('gulp-cssnano');
var svgsprite = require('gulp-svg-sprite');
var buffer = require('vinyl-buffer');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var concat 	= require('gulp-concat');
var uglify 	= require('gulp-uglify');


/*** All directories ***/
const dirs = {
    root: '.',
    src: 'src',
    dist: 'dist'
}

const scss_paths = {
    src: `${dirs.src}/scss/`,
    dist: `${dirs.dist}/css/`,
    files: `${dirs.src}/scss/main.scss`
}

const js_paths = {
    src: `${dirs.src}/js/`,
    dist: `${dirs.dist}/js/`
}

const img_paths = {
    src: `${dirs.src}/images/`,
    dist: `${dirs.dist}/images/`
}

/***Live Reload***/

/*Browsersync*/

function browser_sync_static() {
  browsersync.init({
      server: {
          baseDir: dirs.root + '/'
      }
  });
  gulp.watch('*.html').on('change', browsersync.reload);
}

function browser_sync_local_server() {
  browsersync.init({
      proxy: "yourlocal.dev"
  });
}


/*** All tasks ***/


function compile_styles() {
  return gulp.src(scss_paths.src +'*.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({ cascade: false }))
      .pipe(cssnano())
      .pipe(gulp.dest(scss_paths.dist));
}

function svg_sprite() {
  return gulp.src(img_paths.src + 'sprites/svg/*.svg')
    .pipe(svgsprite({
        mode: {
          symbol: { // symbol mode to build the SVG
            dest: './svg/', // destination folder
            sprite: 'all-sprites.svg', //sprite name
            example: true // Build sample page
          }
        },
        svg: {
          xmlDeclaration: false, // strip out the XML attribute
          doctypeDeclaration: false // don't include the !DOCTYPE declaration
        }
    }))
    .pipe(gulp.dest(img_paths.dist+'sprites/'));
}

function normal_sprite() {
  // Generate our spritesheet
  var spritedata = gulp.src(img_paths.src + 'sprites/normal/*.png').pipe(spritesmith({
    imgName: 'generated-sprite.png',
    cssName: '_generated-sprite.scss',
    imgPath: '../images/sprites/normal/generated-sprite.png',
  }));

  // Pipe image stream through image optimizer and onto disk
  var imgstream = spritedata.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(img_paths.dist + 'sprites/normal/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssstream = spritedata.css
    .pipe(gulp.dest(scss_paths.src +'helpers/'));

  // Return a merged stream to handle both `end` events
  return merge(imgstream, cssstream);
}

/*Compress Images*/
function compress_images() {
  return gulp
  .src([img_paths.src +'*', img_paths.src +'**/*', '!'+ img_paths.src+'/sprites/**'])
  .pipe(imagemin())
  .pipe(gulp.dest(img_paths.dist));
}

/* Scripts */

function compile_scripts() {
  return gulp
	/* .src([js_paths.src+'xxx.js',js_paths.src+'*.js'] , {
		sourcemaps: true
  }) */

  .src(js_paths.src+'*.js', {
		sourcemaps: true
	})
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(gulp.dest(js_paths.dist));
}




/*Important tasks*/

//gulp.task("watch", function () {
   // gulp.watch(dirs.src + '/scss/**/*.scss', ['compile-styles']);
//});

function watch () {
  gulp.watch(dirs.src + '/scss/**/*.scss', compile_styles);
}
/* var build = gulp.parallel(browser_sync_static,watch); */
var build = gulp.parallel(watch);

//gulp.task('dev',['compile-styles']);
/* gulp.task('default',['browser-sync-static','watch'] ); */

gulp.task('compile-script', compile_scripts);
gulp.task('compress-images', compress_images);
gulp.task('normal-sprite', normal_sprite);
gulp.task('svg-sprite', svg_sprite);
gulp.task('dev', compile_styles);
gulp.task('default',build);
