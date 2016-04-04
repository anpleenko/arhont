'use strict';

import gulp            from 'gulp';
import runSequence     from 'run-sequence';
import fs              from 'fs';
import perfectionist   from 'perfectionist';
import mqpacker        from "css-mqpacker";
import autoprefixer    from 'autoprefixer';
import browserSync     from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const env = {
    src: {
        scss: ['./scss/**/*.scss'],
    },
    dest: {
        scss: './css',
    },
    watch: {
        scss: ['./scss/**/*.scss'],
        js: ['./js/**/*.js'],
        json: ['./data.json']
    },
    browserSync: {
        server: {baseDir: "./"},
        open: false
    },
    PROCESSORS: [
        autoprefixer({ browsers: ['last 2 versions', '> 1%'] }),
        mqpacker
    ],
    sequence:{
        build: ['browserSync', 'scss']
    }
}

let $ = gulpLoadPlugins({});
let reload = browserSync.reload;

gulp.task('browserSync', () => {
    browserSync(env.browserSync)
    gulp.watch("./*.html").on('change', browserSync.reload);
})

gulp.task('scss', () => {
    return gulp.src(env.src.scss)
        .pipe($.sass().on('error', $.notify.onError()))
        .pipe($.postcss(env.PROCESSORS))
        .pipe($.csso())
        .pipe($.postcss([perfectionist({})]))
        .pipe(gulp.dest(env.dest.scss))
        .pipe(reload({stream: true}))
})

gulp.task('build', () =>{runSequence(env.sequence.build)})

gulp.task('default', ['build'], () => {
    $.watch(env.watch.scss, () => gulp.start('scss'));
    $.watch(env.watch.js, browserSync.reload);
    $.watch(env.watch.json, browserSync.reload);
})
