// -------------------------------------
// Packages
// -------------------------------------

const gulp = require('gulp'),
      { dest, parallel, series, src, watch } = require('gulp'),
      imageResize = require('gulp-image-resize'),
      log = require('fancy-log'),
      merge2 = require('merge2'),
      newer = require('gulp-newer'),
      rename = require('gulp-rename'),
      tap = require('gulp-tap');

const thumbnailsSource = 'media/projects/**/thumbnails/*.*',
      thumbnailsDestination = 'media/projects-optimized',
      imagesSource = 'media/projects/**/images/*.*',
      imagesDestination = 'media/projects-optimized';

// -------------------------------------
// Variables, constants, …
// -------------------------------------

var   projectName;

/*
** Properties of the various transformations on the thumbnails
*/

const thumbnailTransformations = [
 {
   quality: 0.76,
   sharpen: '0.25x0.25+0.25+0.05',
   width: 1440
 },
];

/*
** Properties of the various transformations on the images
*/

const imageTransformations = [
  {
    quality: 0.88,
    sharpen: '0.25x0.25+0.25+0.05', // 0.5x0.5+0.5+0.1
    width: 360
  },
  {
    quality: 0.84,
    sharpen: '0.25x0.25+0.25+0.05',
    width: 720
  },
  {
    quality: 0.80,
    sharpen: '0.25x0.25+0.25+0.05',
    width: 1080
  },
  {
    quality: 0.76,
    sharpen: '0.25x0.25+0.25+0.05',
    width: 1440
  },
  {
    quality: 0.72,
    sharpen: '0.25x0.25+0.25+0.05',
    width: 2160
  },
  {
    quality: 0.72,
    sharpen: '0.25x0.25+0.25+0.05',
    width: 2880
  },
];

// -------------------------------------
// Tasks
// -------------------------------------

/*
** Hello world!
** gulp hello
*/

function hello(cb) {
  console.log('Hello world!');

  cb();
}

/*
** Resize thumbnails
** gulp resizeThumbnails
*/

function resizeThumbnails(cb) {

  // Create an array
  const streams = [];

  // Go through the array of transformations
  thumbnailTransformations.forEach(function (transformation) {
    streams.push(
      src(thumbnailsSource, { nodir: true }) // ignore empty directories
      // Retrieve the name of the project folder and save it in the global variable 'projectName'
      .pipe(tap(function(file, t) {
        // Cut the name of the project out from the path to the file
        projectName = file.path.substring(
          file.path.lastIndexOf("/projects/") + 10,
          file.path.lastIndexOf("/thumbnails/")
        );
       }))
      .on('end', function() { console.log(projectName) })
      .pipe(
        newer(
          thumbnailsDestination +
          '/' +
          projectName +
          '/thumbnails/' +
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
        format: 'jp2',
        interlace: true,
        imageMagick: true,
        noProfile: true,
        quality: transformation.quality,
        sharpen: transformation.sharpen,
        upscale : false
      }))
      .pipe(rename(function (path) {
          //path.dirname = path.dirname.replace(/src/i, transformation.width.toString());
          path.dirname = path.dirname.concat('/' + transformation.width.toString() + '/');
      }))
      .pipe(dest(thumbnailsDestination))
    );
  });

  // Merge the streams
  return merge2(streams);

  cb();
}

/*
** Resize images
** gulp resizeImages
*/

function resizeImages(cb) {

  // Create an array
  const streams = [];

  // Go through the array of transformations
  imageTransformations.forEach(function (transformation) {
    streams.push(
      src(imagesSource, { nodir: true }) // ignore empty directories
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
          imagesDestination +
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
        quality: transformation.quality,
        sharpen: transformation.sharpen,
        upscale : false
      }))
      .pipe(rename(function (path) {
          //path.dirname = path.dirname.replace(/src/i, transformation.width.toString());
          path.dirname = path.dirname.concat('/' + transformation.width.toString() + '/');
      }))
      .pipe(dest(imagesDestination))
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
exports.resizeThumbnails = resizeThumbnails;
exports.resizeImages = resizeImages;

// Use series() and parallel() to compose tasks
// A composition of tasks composed with series() ends after an error
// See https://gulpjs.com/docs/en/getting-started/creating-tasks

exports.default = function() {
  watch(imagesSource, series(resizeImages));
};
