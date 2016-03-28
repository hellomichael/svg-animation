/*
  svgTween.js v1.0.0
  Licensed under the MIT license.
  http://www.opensource.org/licenses/mit-license.php

  Copyright 2016
  http://www.hellomichael.com/
*/

; (function(window) {
  'use strict';

  var svgTween = function (options) {
    var self = this;
    self.options = extend(self.options, options);
    self.init();
  };

  svgTween.prototype = {
    constructor: svgTween,

    options: {
      element:    null,
      type:       null,
      keyframes:  null,
      duration:   null,
      originX:    null,
      originY:    null
    },

    init: function () {
      var self = this;

      // Set type
      self.options.type = self.options.element.node.getAttributeNode('class').value;

      // Set bbox to specific transform element (.translate, .scale, .rotate)
      var bBox = self.options.element.getBBox();

      // Set origin as specified or default to center
      self.options.originX = self.options.keyframes[0].cx ? self.getOriginX(bBox, self.options.keyframes[0].cx) : self.getOriginX(bBox, 'center');
      self.options.originY = self.options.keyframes[0].cy ? self.getOriginY(bBox, self.options.keyframes[0].cy) : self.getOriginY(bBox, 'center');

      // Reset and play tween
      self.resetTween(self.options.element, self.options.type, self.options.keyframes, self.options.originX, self.options.originY);
      self.playTween(self.options.element, self.options.type, self.options.keyframes, self.options.originX, self.options.originY, self.options.duration, 0);
    },

    /*
      Recursively loop through keyframes to create pauses or tweens

      @param {Object} element
      @param {String} type - "scale", "rotate", "translate"
      @param {Array}  keyframes
      @param {String} originX - "left", "right", "center"
      @param {String} originY - "top", "bottom", "center"
      @param {Int}    duration 
      @param {Int}    index
    */
    playTween: function(element, type, keyframes, originX, originY, duration, index) {
      var self = this, transform, translateX, translateY, rotationAngle, scaleX, scaleY, newDuration, easing;
      
      // Set keyframes we're transitioning to
      if (type === 'translate') {
        translateX = keyframes[index].x;
        translateY = keyframes[index].y;
        transform = 'T ' + translateX + ' ' + translateY;
      }

      else if (type === 'rotate') {
        rotationAngle = keyframes[index].angle;
        transform = 'R ' + rotationAngle + ' ' + originX + ' ' + originY;
      }

      else if (type === 'scale') {
        scaleX = keyframes[index].x;
        scaleY = keyframes[index].y;
        transform = 'S ' + scaleX + ' ' + scaleY + ' ' + originX + ' ' + originY;
      }
      
      // Set duration as an initial pause or the difference of steps in between keyframes
      newDuration = index ? ((keyframes[index].step - keyframes[(index-1)].step) * duration) : (keyframes[index].step * duration);

      // Set easing parameter
      easing = mina[keyframes[index].easing];

      // Skip first tween if animation immediately starts on step 0
      if (index === 0 && keyframes[index].step === 0) {
        self.playTween(element, type, keyframes, originX, originY, duration, (index + 1));
      }

      // Or pause tween if initial keyframe
      else if (index === 0 && keyframes[index].step !== 0) {
        setTimeout(function() {
          if (index !== (keyframes.length - 1)) {
            self.playTween(element, type, keyframes, originX, originY, duration, (index + 1));
          }
        }, newDuration);
      }

      // Or animate tweens if keyframes exist
      else {
        element.animate({
          transform: transform
        }, newDuration, easing, function() {

          
          if (index !== (keyframes.length - 1)) {
            self.playTween(element, type, keyframes, originX, originY, duration, (index + 1));
          }
        });
      }
    },

    /*
      Resets the illustration to the first keyframe

      @param {Object} element
      @param {String} type - "scale", "rotate", "translate"
      @param {Array}  keyframes
      @param {String} originX - "left", "right", "center"
      @param {String} originY - "top", "bottom", "center"
    */
    resetTween: function (element, type, keyframes, originX, originY) {
      var transform, translateX, translateY, rotationAngle, scaleX, scaleY;
      
      if (type === 'translate') {
        translateX = keyframes[0].x;
        translateY = keyframes[0].y;
        transform = 'T ' + translateX + ' ' + translateY;
      }

      else if (type === 'rotate') {
        rotationAngle = keyframes[0].angle;
        transform = 'R ' + rotationAngle + ' ' + originX + ' ' + originY;
      }

      else if (type === 'scale') {
        scaleX = keyframes[0].x;
        scaleY = keyframes[0].y;
        transform = 'S ' + scaleX + ' ' + scaleY + ' ' + originX + ' ' + originY;
      }

      element.transform(transform);
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
    @param {Object} a 
    @param {Object} b
    @return {Object} sum
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

  // Add to namespace
  window.svgTween = svgTween;
})(window);