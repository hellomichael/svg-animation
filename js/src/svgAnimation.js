/*
  svgAnimation.js v1.0.0
  Licensed under the MIT license.
  http://www.opensource.org/licenses/mit-license.php

  Copyright 2016
  http://www.hellomichael.com/
*/

; (function(window) {
  'use strict';

  var svgAnimation = function (options) {
    var self = this;
    self.options = extend(self.options, options);
    self.init();
  };
  
  svgAnimation.prototype = {
    constructor: svgAnimation,

    options: {
      canvas:     null,
      svg:        null
    },

    init: function() {
      var self = this;
      
      self.loadSVG(self.options.canvas, self.options.svg);
    },

    /*
      Loads the SVG into the DOM
      @param {Object}   canvas
      @param {String}   svg
    */
    loadSVG: function(canvas, svg) {
      Snap.load(svg, function(data) {
        canvas.append(data);
      });
    }
  };

  /*
    Merges two objects together
    @param  {Object}  a 
    @param  {Object}  b
    @return {Object}  sum
    http://stackoverflow.com/questions/11197247/javascript-equivalent-of-jquerys-extend-method
  */
  function extend(a, b) {
    for (var key in b) { 
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  }

  // Add to global namespace
  window.svgAnimation = svgAnimation;
})(window);