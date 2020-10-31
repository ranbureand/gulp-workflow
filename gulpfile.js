const gulp = require('gulp');
const { dest, parallel, series, src, watch } = require('gulp');
const imageResize = require("gulp-image-resize");
const rename = require("gulp-rename");
const sizeOf = require('image-size');
const merge2 = require("merge2");
var newer = require('gulp-newer');
//const gm = require("gulp-gm"); // to remove

const transformations = [
 {
   width: 360,
 },
 {
   width: 720,
 },
 {
   width: 1080,
 },
 {
   width: 1440,
 },
 {
   width: 2160,
 },
 {
   width: 2880,
 },
];

const imageSrc = 'media/projects/**/images/src/*.*',
      imageDest = 'media/projects'

function hello(cb) {
  console.log('Hello world!');

  cb();
}

function copy(cb) {

  const streams = [];

  transformations.forEach(function (transformation) {
    streams.push(
      src(imageSrc, { nodir: true })
      .pipe(imageResize({
        width : transformation.width,
        height : 0,
        colorspace: 'sRGB',
        crop : false,
        filter: 'Lanczos',
        format: 'jpeg',
        interlace: true,
        imageMagick: true,
        noProfile: true,
        quality: 0.88,
        sharpen: '0.5x0.5+0.5+0.1',
        upscale : false
      }))
      .pipe(rename(function (path) {
          path.dirname = path.dirname.replace(/src/i, transformation.width.toString());
      }))
      .pipe(dest(imageDest))
    );
  });

  return merge2(streams);

  cb();
}

// Exported tasks/functions are public and can be run with the `gulp` command
// Non-exported tasks/functions are private and can not be run with the `gulp` command
// See https://gulpjs.com/docs/en/getting-started/creating-tasks

exports.hello = hello;
exports.copy = copy;

// Use series() and parallel() to compose tasks
// A composition of tasks composed with series() ends after an error
// See https://gulpjs.com/docs/en/getting-started/creating-tasks

//exports.default = hello;

exports.default = function() {
  watch('source/*.txt', series(hello, copy));
};
