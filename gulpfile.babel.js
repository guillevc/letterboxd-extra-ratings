'use strict';

import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('clean', del.bind(null, ['dist']));

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
      'src/**/*',
      'src/**/_*.js',
      '!src/**/*.js'
      ])
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel', 'copy']);

gulp.task('watch', ['build'], () => {
  gulp.watch([
    'src/js/**/*.js',
    '!src/js/**/_*.js'
  ], ['babel']);
});

gulp.task('default', ['watch']);
