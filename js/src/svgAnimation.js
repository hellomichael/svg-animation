/*
  svgAnimation.js v1.0.0
  Licensed under the MIT license.
  http://www.opensource.org/licenses/mit-license.php

  Copyright 2016
  http://www.hellomichael.com/
*/

; (function(window) {
  'use strict';

  var svgAnimation = function () {
    var self = this;
    self.init();
  };

  svgAnimation.prototype = {
    constructor: svgAnimation,

    init: function() {
      var s = Snap("#canvas");

      Snap.load('svg/backpack.svg', function (data) {
        s.append(data);
      });
    }
  };

  // Add to global namespace
  window.svgAnimation = svgAnimation;
})(window);