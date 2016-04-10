'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('babel', () => {
  return gulp.src([
      'src/js/**/*.js',
      '!src/js/**/_*.js'
      ])
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', () => {
  return gulp.src([
      'src/**/*',
      '!src/js/**/*.js'
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
