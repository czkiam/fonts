'use strict';

var gulp = require('gulp');
var pug  = require('gulp-pug');
var json = require('gulp-json-transform');
var gutil = require('gulp-util');

gulp.task('pug', function buildHTML() {
  return gulp.src('./index.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(gulp.dest('./preview'));
});

function createCss(filename, string) {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({
      cwd: "",
      base: "",
      path: filename + ".css",
      contents: new Buffer(string)
    }))
    this.push(null)
  }
  return src
}

gulp.task('generate', function() {
  return gulp.src('./fonts.json')
    .pipe(json(function(data, file) {

        for (var i = 0; i < data.fonts.length; i++) {
          var styles = data.fonts[i].styles
          var content = '';
          var fontName = data.fonts[i].name;
          var separator = data.config.separator;
          var path = data.config.path;
          var style = '';
          var fullPath = '';

          for (var z = 0; z < styles.length; z++) {
            if (styles.length > 0) {
              style = fontName + separator + styles[z];
            } else {
              style = fontName;
            }
            fullPath = path + '/' + fontName + '/' + style;

            content += '@font-face {\n';
            content += '  font-family: "' + style + '";\n';
            content += '  src: url("' + fullPath + '.eot");\n';
            content += '  src: url("' + fullPath + '.eot?#iefix") format("embedded-opentype"), ';
            content += 'url("' + fullPath + '.woff") format("woff"), ';
            content += 'url("' + fullPath + '.ttf") format("truetype"), ';
            content += 'url("' + fullPath + '.svg") format("svg"); }\n';
            if (z < styles.length -1) {
              content += '\n';
            }
          }
          createCss( data.fonts[i].name,
            content
          )
          .pipe(gulp.dest('./css'))
          console.log('CSS generated for font ', data.fonts[i].name)

        }
        return {};
    }))
});
