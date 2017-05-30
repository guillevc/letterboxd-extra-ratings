'use strict';

// TODO: use gulpif
// watch all files not only es6

import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import zip from 'gulp-zip';

gulp.task('clean', del.bind(null, ['dist', 'dist-zip']));

gulp.task('babel', () => {
  return gulp.src([
      'src/**/*.js',
      '!src/**/_*.js'
      ], {
        base: 'src',
        dot: true
      })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', () => {
  return gulp.src([
      'src/**',
      'src/**/_*.js',
      '!src/**/*.js'
      ])
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel', 'copy']);

gulp.task('watch', ['build'], () => {

  // Watching es6 javascript files
  gulp.watch([
    'src/**/*.js',
    '!src/**/_*.js'
  ], ['babel']);

  // also watch for other files to copy

});

gulp.task('zip', ['build'], () => {
  const manifest = require('./src/manifest');
  const packagejson = require('./package.json');
  const fileName = `${packagejson.name}-v${manifest.version}.zip`;

  return gulp.src('dist/')
    .pipe(zip(fileName))
    .pipe(gulp.dest('dist-zip/'));
});

gulp.task('default', ['watch']);
