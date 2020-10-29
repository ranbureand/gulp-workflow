const gulp = require('gulp');
const { dest, parallel, series, src } = require('gulp');

function hello(cb) {
  console.log('Hello world!');

  cb();
}

function copy(cb) {
  return src('source/*.txt')
    .pipe(dest('destination'));

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

exports.default = hello;
