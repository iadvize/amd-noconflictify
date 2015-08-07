'use strict';

var through = require('through2');
var prefix = '(function(undefined){if(typeof define==="function"&&define.amd){var __amdnoconflictify__=define;define=undefined;}';
var suffix = 'if(__amdnoconflictify__)define=__amdnoconflictify__;})();';

/**
 * Create a stream that wrap the input between a prefix and a suffix string.
 *
 * @param {String} prefix
 * @param {String} suffix
 * @return {Stream}
 */
function wrapperStream(prefix, suffix) {
  var firstChunk = true;

  var stream = through(function (chunk, encoding, next) {
    if (firstChunk) {
      this.push(new Buffer(prefix));
      firstChunk = false;
    }

    this.push(chunk);
    next();

  }, function(next) {
    this.push(new Buffer(suffix));
    next();
  });

  stream.label = 'amdnoconflictify';
  return stream;
}

/**
 * Add a hook on the browserify bundle process
 * to wrap each final bundle into our prefix and suffix code.
 *
 * @param {Browserify} browserify
 */
module.exports = function amdnoconflictify(browserify) {

  browserify.on('bundle', function() {
    browserify.pipeline.get('wrap').push(wrapperStream(prefix, suffix));
  });

};
