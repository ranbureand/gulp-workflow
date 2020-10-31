// -------------------------------------
// Packages
// -------------------------------------

const gulp = require('gulp'),
      { dest, parallel, series, src, watch } = require('gulp'),
      imageResize = require("gulp-image-resize"),
      log = require('fancy-log'),
      merge2 = require("merge2"),
      newer = require('gulp-newer'),
      rename = require("gulp-rename"),
      tap = require('gulp-tap');

const imageSource = 'media/projects/**/images/src/*.*',
      imageDestination = 'media/projects'

// -------------------------------------
// Variables, constants, …
// -------------------------------------

var   projectName;

/*
** Properties of the various transformations on the images
*/

const transformations = [
 {
   width: 360,
   sharpen: '0.5x0.5+0.5+0.1'
 },
 {
   width: 720,
   sharpen: '0.5x0.5+0.5+0.1'
 },
 {
   width: 1080,
   sharpen: '0.5x0.5+0.5+0.1'
 },
 {
   width: 1440,
   sharpen: '0.5x0.5+0.5+0.1'
 },
 {
   width: 2160,
   sharpen: '0.5x0.5+0.5+0.1'
 },
 {
   width: 2880,
   sharpen: '0.5x0.5+0.5+0.1'
 },
];

// -------------------------------------
// Tasks
// -------------------------------------

/*
** Hello world!
*/

function hello(cb) {
  console.log('Hello world!');

  cb();
}

/*
** Hello world!
*/

function resize(cb) {

  // Create an array
  const streams = [];

  // Go through the array of transformations
  transformations.forEach(function (transformation) {
    streams.push(
      src(imageSource, { nodir: true }) // ignore empty directories
      // Retrieve the name of the project folder and save it in the global variable 'projectName'
      .pipe(tap(function(file, t) {
        // Cut the name of the project out from the path to the file
        projectName = file.path.substring(
          file.path.lastIndexOf("/projects/") + 10,
          file.path.lastIndexOf("/images/")
        );
       }))
      .on('end', function() { console.log(projectName) })
      .pipe(
        newer(
          imageDestination +
          '/' +
          projectName +
          '/images/' +
          transformation.width
        )
      )
      // Resize the image
      .pipe(imageResize({
        width : transformation.width,
        height : 0,
        colorspace: 'sRGB',
        crop : false,
        filter: 'Lanczos',
        format: 'jpg',
        interlace: true,
        imageMagick: true,
        noProfile: true,
        quality: 0.88,
        sharpen: transformation.sharpen,
        upscale : false
      }))
      .pipe(rename(function (path) {
          path.dirname = path.dirname.replace(/src/i, transformation.width.toString());
      }))
      .pipe(dest(imageDestination))
    );
  });

  // Merge the streams
  return merge2(streams);

  cb();
}

// Exported tasks/functions are public and can be run with the `gulp` command
// Non-exported tasks/functions are private and can not be run with the `gulp` command
// See https://gulpjs.com/docs/en/getting-started/creating-tasks

exports.hello = hello;
exports.resize = resize;

// Use series() and parallel() to compose tasks
// A composition of tasks composed with series() ends after an error
// See https://gulpjs.com/docs/en/getting-started/creating-tasks

exports.default = function() {
  watch(imageSource, series(resize));
};
