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
      keyframes:  null,
      duration:   null
    },

    init: function () {
      var self = this;

      // Reset and play tween
      self.resetTween(self.options.element, self.options.keyframes);
      self.playTween(self.options.element, self.options.keyframes, self.options.duration, 0);
    },

    /*
      Recursively loop through keyframes to create pauses or tweens

      @param {Object} element
      @param {Array}  keyframes
      @param {Int}    duration 
      @param {Int}    index
    */
    playTween: function(element, keyframes, duration, index) {
      var self = this, translateX, translateY, newDuration, easing;
      
      // Set keyframes we're transitioning to
      translateX = keyframes[index].x;
      translateY = keyframes[index].y;
      
      // Set duration as an initial pause or the difference of steps in between keyframes
      newDuration = index ? ((keyframes[index].step - keyframes[(index-1)].step) * duration) : (keyframes[index].step * duration);

      // Set easing parameter
      easing = mina[keyframes[index].easing];

      // Skip first tween if animation immediately starts on step 0
      if (index === 0 && keyframes[index].step === 0) {
        self.playTween(element, keyframes, duration, (index + 1));
      }

      // Or pause tween if initial keyframe
      else if (index === 0 && keyframes[index].step !== 0) {
        setTimeout(function() {
          if (index !== (keyframes.length - 1)) {
            self.playTween(element, keyframes, duration, (index + 1));
          }
        }, newDuration);
      }

      // Or animate tweens if keyframes exist
      else {
        element.animate({
          transform: 'T' + translateX + ' ' + translateY
        }, newDuration, easing, function() {
          if (index !== (keyframes.length - 1)) {
            self.playTween(element, keyframes, duration, (index + 1));
          }
        });
      }
    },

    /*
      Resets the illustration to the first keyframe

      @param {Object} element
      @param {Array}  keyframes
    */
    resetTween: function (element, keyframes) {
      var translateX = keyframes[0].x;
      var translateY = keyframes[0].y;

      element.transform('T' + translateX + ',' + translateY);
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