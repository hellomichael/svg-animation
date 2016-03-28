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
      http://stackoverflow.com/questions/9723422/is-there-some-innerhtml-replacement-in-svg-xml
    */

    loadSVG: function(canvas, svg) {
      var self = this;

      Snap.load(svg, function(data) {
        // Place SVG nodes into DOM tree
        canvas.append(data);

        // Zipper animation
        var $zipper = canvas.select("#zipper");
        self.createTransformGroup($zipper);

        var duration = 2000/10;

        // Translate tween
        new svgTween({
          element: $zipper.select('.translate'),
          keyframes: [
            {
              "step": 2,
              "x": 90,
              "y": 0
            },

            {
              "step": 5,
              "x": 0,
              "y": 0,
              "easing": "easeOutQuint"
            }
          ],
          duration: duration
        });
      });
    },

    /*
      Create scale, rotate, and transform groups around an SVG DOM node
      @param {object} Snap element
    */
    createTransformGroup: function(element) {
      if (element.node) {
        var $translateGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var $rotateGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var $scaleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        $scaleGroup.setAttribute('class', 'scale');
        $rotateGroup.setAttribute('class', 'rotate');
        $translateGroup.setAttribute('class', 'translate');

        // Clone original child nodes into scale group
        for (var i = 0; i < element.node.childNodes.length; i++) {
          $scaleGroup.appendChild(element.node.childNodes[i].cloneNode()); 
        }

        // Empty original node
        while (element.node.hasChildNodes()) {
          element.node.removeChild(element.node.lastChild);
        }

        // Replace with new transform groups
        element.node.appendChild($translateGroup).appendChild($rotateGroup).appendChild($scaleGroup);
      }
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