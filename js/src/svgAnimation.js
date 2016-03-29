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
    self.options = extend({}, self.options);      
    extend(self.options, options);
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

        // Scale Tween
        var $scaleElement = $zipper.select('.scale');
        var scaleBBox = $scaleElement.getBBox();

        $scaleElement.transform('S' + 0 + ' ' + 0 + ' ' + self.getOriginX(scaleBBox, 'center') + ' ' + self.getOriginY(scaleBBox, 'top'));
        $scaleElement.animate({transform: 'S' + 1 + ' ' + 1 + ' ' + self.getOriginX(scaleBBox, 'center') + ' ' + self.getOriginY(scaleBBox, 'top')}, 400, mina['easeOutBack']);

        // Rotate Tween
        var $rotateElement = $zipper.select('.rotate');
        var rotateBBox = $rotateElement.getBBox();
        $rotateElement.transform('R' + 45 + ' ' + self.getOriginX(rotateBBox, 'center') + ' ' + self.getOriginY(rotateBBox, 'top'));
        
        $rotateElement.animate({ transform: 'R' + -45 + ' ' + self.getOriginX(rotateBBox, 'center') + ' ' + self.getOriginY(rotateBBox, 'top')}, 400, mina['easeOutBack'], function() {
          $rotateElement.animate({ transform: 'R' + 30 + ' ' + self.getOriginX(rotateBBox, 'center') + ' ' + self.getOriginY(rotateBBox, 'top')}, 400, mina['easeOutBack'], function() {
            $rotateElement.animate({ transform: 'R' + 0 + ' ' + self.getOriginX(rotateBBox, 'center') + ' ' + self.getOriginY(rotateBBox, 'top')}, 400, mina['easeInOutBack']);
          });
        });

        // Translate Tween
        var $translateElement = $zipper.select('.translate');
        $translateElement.transform('T' + 90 + ' ' + 0);

        setTimeout(function() {
          $translateElement.animate({ transform: 'T' + 0 + ' ' + 0 }, 600, mina['easeOutQuint']);
        }, 400);
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
    },

    /*
      Translates the horizontal origin from a string to pixel value

      @param {Object}     Snap bBox
      @param {String}     "left", "right", "center"
      @return {Object}    pixel value
    */
    getOriginX: function (bBox, direction) {
      if (direction === 'left') {
        return bBox.x;
      }

      else if (direction === 'center') {
        return bBox.cx;
      }

      else if (direction === 'right') {
        return bBox.x2;
      }
    },

    /*
      Translates the vertical origin from a string to pixel value

      @param {Object}     Snap bBox
      @param {String}     "top", "bottom", "center"
      @return {Object}    pixel value
    */
    getOriginY: function (bBox, direction) {
      if (direction === 'top') {
        return bBox.y;
      }

      else if (direction === 'center') {
        return bBox.cy;
      }

      else if (direction === 'bottom') {
        return bBox.y2;
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