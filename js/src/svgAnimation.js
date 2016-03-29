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
      data:                 null,
      canvas:               null,
      svg:                  null,
      duration:             null,
      steps:                null
    },

    init: function() {
      var self = this;

      self.loadJSON(self.options.data, function (data) {
        self.loadSVG(self.options.canvas, self.options.svg, data.animations, (self.options.duration/self.options.steps));
      });
    },

    /*
      Loads the SVG into the DOM
      @param {Object}   canvas
      @param {String}   svg
      http://stackoverflow.com/questions/9723422/is-there-some-innerhtml-replacement-in-svg-xml
    */
    loadJSON: function(data, callback) {
      var self = this;

      // XML request
      var xobj = new XMLHttpRequest();
      xobj.open('GET', data, true);

      xobj.onreadystatechange = function() {
        // Success
        if (xobj.readyState === 4 && xobj.status === 200) {
          var json = JSON.parse(xobj.responseText);

          if (callback && typeof(callback) === "function") {
            callback(json);
          }
        }
      };

      xobj.send(null);
    },

    /*
      Loads the SVG into the DOM and creates tweens ready for playback

      @param {Object}   canvas
      @param {String}   svg
      @param {Array}    animations
      @param {Int}      duration 
      @param {Function} callback 
    */

    loadSVG: function(canvas, svg, animations, duration) {
      var self = this;

      Snap.load(svg, function(data) {
        // Place SVG nodes into DOM tree
        canvas.append(data);

        // Create tweens for each animation
        animations.forEach(function(animation) {
          var element = canvas.select(animation.id);
          
          // Create scale, rotate, and transform groups around an SVG node
          self.createTransformGroup(element);

          // Create tween based on keyframes
          if (animation.keyframes.translateKeyframes) {
            new svgTween({
              element: element.select('.translate'),
              keyframes: animation.keyframes.translateKeyframes,
              duration: duration
            });
          }

          if (animation.keyframes.rotateKeyframes) {
           new svgTween({
              element: element.select('.rotate'),
              keyframes: animation.keyframes.rotateKeyframes,
              duration: duration
            });
          }

          if (animation.keyframes.scaleKeyframes) {
            new svgTween({
              element: element.select('.scale'),
              keyframes: animation.keyframes.scaleKeyframes,
              duration: duration
            });
          }
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