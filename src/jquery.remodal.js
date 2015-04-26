!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      return factory(root, $);
    });
  } else if (typeof exports === 'object') {
    factory(root, require('jquery'));
  } else {
    factory(root, root.jQuery || root.Zepto);
  }
})(this, function(global, $) {

  'use strict';

  /**
   * Animationend event with vendor prefixes
   * @private
   * @const
   * @type {String}
   */
  var ANIMATIONEND_EVENTS = 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd';

  /**
   * Animationstart event with vendor prefixes
   * @private
   * @const
   * @type {String}
   */
  var ANIMATIONSTART_EVENTS = 'animationstart webkitAnimationStart MSAnimationStart oAnimationStart';

  /**
   * Name of the plugin
   * @private
   * @const
   * @type {String}
   */
  var PLUGIN_NAME = 'remodal';

  /**
   * Namespace for CSS and events
   * @private
   * @const
   * @type {String}
   */
  var NAMESPACE = global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.NAMESPACE || PLUGIN_NAME;

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULTS = $.extend({
    hashTracking: true,
    closeOnConfirm: true,
    closeOnCancel: true,
    closeOnEscape: true,
    closeOnAnyClick: true
  }, global.REMODAL_GLOBALS && global.REMODAL_GLOBALS.DEFAULTS);

  /**
   * States of the Remodal
   * @private
   * @const
   * @enum {String}
   */
  var STATES = {
    CLOSING: 'closing',
    CLOSED: 'closed',
    OPENING: 'opening',
    OPENED: 'opened'
  };

  /**
   * Reasons of the state change.
   * @private
   * @const
   * @enum {String}
   */
  var STATE_CHANGE_REASONS = {
    CONFIRMATION: 'confirmation',
    CANCELLATION: 'cancellation'
  };

  /**
   * Current modal
   * @private
   * @type {Remodal}
   */
  var current;

  /**
   * Scrollbar position
   * @private
   * @type {Number}
   */
  var scrollTop;

  /**
   * Get an animation duration
   * @private
   * @param {jQuery} $elem
   * @return {Number}
   */
  function getAnimationDuration($elem) {
    var duration = $elem.css('animation-duration') ||
        $elem.css('-webkit-animation-duration') ||
        $elem.css('-moz-animation-duration') ||
        $elem.css('-o-animation-duration') ||
        $elem.css('-ms-animation-duration') ||
        '0s';

    var delay = $elem.css('animation-delay') ||
        $elem.css('-webkit-animation-delay') ||
        $elem.css('-moz-animation-delay') ||
        $elem.css('-o-animation-delay') ||
        $elem.css('-ms-animation-delay') ||
        '0s';

    var iterationCount = $elem.css('animation-iteration-count') ||
        $elem.css('-webkit-animation-iteration-count') ||
        $elem.css('-moz-animation-iteration-count') ||
        $elem.css('-o-animation-iteration-count') ||
        $elem.css('-ms-animation-iteration-count') ||
        '1';

    var max;
    var len;
    var num;
    var i;

    duration = duration.split(', ');
    delay = delay.split(', ');
    iterationCount = iterationCount.split(', ');

    // The 'duration' size is the same as the 'delay' size
    for (i = 0, len = duration.length, max = Number.NEGATIVE_INFINITY; i < len; i++) {
      num = parseFloat(duration[i]) * parseInt(iterationCount[i]) + parseFloat(delay[i]);

      if (num > max) {
        max = num;
      }
    }

    return num;
  }

  /**
   * Get a scrollbar width
   * @private
   * @return {Number}
   */
  function getScrollbarWidth() {
    if ($(document.body).height() <= $(window).height()) {
      return 0;
    }

    var outer = document.createElement('div');
    var inner = document.createElement('div');
    var widthNoScroll;
    var widthWithScroll;

    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    document.body.appendChild(outer);

    widthNoScroll = outer.offsetWidth;

    // Force scrollbars
    outer.style.overflow = 'scroll';

    // Add inner div
    inner.style.width = '100%';
    outer.appendChild(inner);

    widthWithScroll = inner.offsetWidth;

    // Remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }

  /**
   * Lock the screen
   * @private
   */
  function lockScreen() {
    var $html = $('html');
    var lockedClass = NAMESPACE + '-is-locked';
    var paddingRight;
    var $body;

    if (!$html.hasClass(lockedClass)) {
      $body = $(document.body);

      // Zepto does not support '-=', '+=' in the `css` method
      paddingRight = parseInt($body.css('padding-right'), 10) + getScrollbarWidth();

      $body.css('padding-right', paddingRight + 'px');
      $html.addClass(lockedClass);
    }
  }

  /**
   * Unlock the screen
   * @private
   */
  function unlockScreen() {
    var $html = $('html');
    var lockedClass = NAMESPACE + '-is-locked';
    var paddingRight;
    var $body;

    if ($html.hasClass(lockedClass)) {
      $body = $(document.body);

      // Zepto does not support '-=', '+=' in the `css` method
      paddingRight = parseInt($body.css('padding-right'), 10) - getScrollbarWidth();

      $body.css('padding-right', paddingRight + 'px');
      $html.removeClass(lockedClass);
    }
  }

  /**
   * Set state for an instance
   * @private
   * @param {Remodal} instance
   * @param {STATES} state
   * @param {Boolean} isSilent If true, Remodal does not trigger events
   * @param {String} Reason of a state change.
   */
  function setState(instance, state, isSilent, reason) {
    instance.$body
      .removeClass(
        NAMESPACE + '-is-' + STATES.CLOSING + ' ' +
        NAMESPACE + '-is-' + STATES.OPENING + ' ' +
        NAMESPACE + '-is-' + STATES.CLOSED + ' ' +
        NAMESPACE + '-is-' + STATES.OPENED)
      .addClass(NAMESPACE + '-is-' + state);

    instance.state = state;
    !isSilent && instance.$modal.trigger({
      type: state,
      reason: reason
    });
  }

  /**
   * Call a function after the animation
   * @private
   * @param {Function} fn
   * @param {Remodal} instance
   */
  function callAfterAnimation(fn, instance) {

    // Element with the longest animation
    var $observableElement = getAnimationDuration(instance.$modal) > getAnimationDuration(instance.$overlay) ?
      instance.$modal : instance.$overlay;
    var isAnimationStarted = false;

    $observableElement.one(ANIMATIONSTART_EVENTS, function() {
      isAnimationStarted = true;

      $observableElement.one(ANIMATIONEND_EVENTS, function(e) {

        // Ignore child nodes
        if (e.target !== this) {
          return;
        }

        fn();
      });
    });

    setTimeout(function() {
      if (isAnimationStarted) {
        return;
      }

      // If the 'animationstart' event wasn't triggered
      $observableElement.off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
      fn();
    }, 25);
  }

  /**
   * Close immediately
   * @private
   * @param {Remodal} instance
   */
  function halt(instance) {
    instance.$overlay.off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
    instance.$modal.off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
    instance.$overlay.hide();
    instance.$wrapper.hide();
    setState(current, STATES.CLOSED, true);
  }

  /**
   * Parse a string with options
   * @private
   * @param str
   * @returns {Object}
   */
  function parseOptions(str) {
    var obj = {};
    var arr;
    var len;
    var val;
    var i;

    // Remove spaces before and after delimiters
    str = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

    // Parse a string
    arr = str.split(',');
    for (i = 0, len = arr.length; i < len; i++) {
      arr[i] = arr[i].split(':');
      val = arr[i][1];

      // Convert a string value if it is like a boolean
      if (typeof val === 'string' || val instanceof String) {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // Convert a string value if it is like a number
      if (typeof val === 'string' || val instanceof String) {
        val = !isNaN(val) ? +val : val;
      }

      obj[arr[i][0]] = val;
    }

    return obj;
  }

  /**
   * Remodal constructor
   * @param {jQuery} $modal
   * @param {Object} options
   * @constructor
   */
  function Remodal($modal, options) {
    var remodal = this;

    remodal.settings = $.extend({}, DEFAULTS, options);
    remodal.index = $[PLUGIN_NAME].lookup.push(remodal) - 1;
    remodal.state = STATES.CLOSED;

    // Build DOM
    remodal.$body = $(document.body);
    remodal.$overlay = $('.' + NAMESPACE + '-overlay');

    if (!remodal.$overlay.length) {
      remodal.$overlay = $('<div>').addClass(NAMESPACE + '-overlay');
      remodal.$body.append(remodal.$overlay);
    }

    remodal.$bg = $('.' + NAMESPACE + '-bg');
    remodal.$wrapper = $('<div>').addClass(NAMESPACE + '-wrapper');
    remodal.$modal = $modal;
    remodal.$modal.addClass(NAMESPACE);
    remodal.$modal.css('visibility', 'visible');

    remodal.$wrapper.append(remodal.$modal);
    remodal.$body.append(remodal.$wrapper);

    // Add the close button event listener
    remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + NAMESPACE + '-action="close"]', function(e) {
      e.preventDefault();

      remodal.close();
    });

    // Add the cancel button event listener
    remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + NAMESPACE + '-action="cancel"]', function(e) {
      e.preventDefault();

      remodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION);

      if (remodal.settings.closeOnCancel) {
        remodal.close(STATE_CHANGE_REASONS.CANCELLATION);
      }
    });

    // Add the confirm button event listener
    remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + NAMESPACE + '-action="confirm"]', function(e) {
      e.preventDefault();

      remodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION);

      if (remodal.settings.closeOnConfirm) {
        remodal.close(STATE_CHANGE_REASONS.CONFIRMATION);
      }
    });

    // Add the keyboard event listener
    $(document).on('keyup.' + NAMESPACE, function(e) {
      if (e.keyCode === 27 && remodal.settings.closeOnEscape && remodal.state === STATES.OPENED) {
        remodal.close();
      }
    });

    // Add the overlay event listener
    remodal.$wrapper.on('click.' + NAMESPACE, function(e) {
      var $target = $(e.target);

      if (!$target.hasClass(NAMESPACE + '-wrapper')) {
        return;
      }

      if (remodal.settings.closeOnAnyClick) {
        remodal.close();
      }
    });
  }

  /**
   * Open a modal window
   * @public
   */
  Remodal.prototype.open = function() {
    var remodal = this;
    var id;

    // Check if the animation was completed
    if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING) {
      return;
    }

    id = remodal.$modal.attr('data-' + PLUGIN_NAME + '-id');

    if (id && remodal.settings.hashTracking) {
      scrollTop = $(window).scrollTop();
      location.hash = id;
    }

    if (current && current !== remodal) {
      halt(current);
    }

    current = remodal;
    lockScreen();
    remodal.$overlay.show();
    remodal.$wrapper.show().scrollTop(0);

    callAfterAnimation(function() {
      setState(remodal, STATES.OPENED);
    }, remodal);

    setState(remodal, STATES.OPENING);
  };

  /**
   * Close a modal window
   * @public
   * @param {String} reason
   */
  Remodal.prototype.close = function(reason) {
    var remodal = this;

    // Check if the animation was completed
    if (remodal.state === STATES.OPENING || remodal.state === STATES.CLOSING) {
      return;
    }

    if (
      remodal.settings.hashTracking &&
      remodal.$modal.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
    ) {
      location.hash = '';
      $(window).scrollTop(scrollTop);
    }

    callAfterAnimation(function() {
      remodal.$overlay.hide();
      remodal.$wrapper.hide();
      unlockScreen();

      setState(remodal, STATES.CLOSED, false, reason);
    }, remodal);

    setState(remodal, STATES.CLOSING, false, reason);
  };

  /**
   * Return a current state of a modal
   * @public
   * @returns {STATES}
   */
  Remodal.prototype.getState = function() {
    return this.state;
  };

  /**
   * Special plugin object for instances.
   * @public
   * @type {Object}
   */
  $[PLUGIN_NAME] = {
    lookup: []
  };

  /**
   * Plugin constructor
   * @param {Object} options
   * @returns {JQuery}
   * @constructor
   */
  $.fn[PLUGIN_NAME] = function(opts) {
    var instance;
    var $elem;

    this.each(function(index, elem) {
      $elem = $(elem);

      if ($elem.data(PLUGIN_NAME) == null) {
        instance = new Remodal($elem, opts);
        $elem.data(PLUGIN_NAME, instance.index);

        if (
          instance.settings.hashTracking &&
          $elem.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
        ) {
          instance.open();
        }
      } else {
        instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
      }
    });

    return instance;
  };

  $(document).ready(function() {

    // data-remodal-target opens a modal window with the special Id.
    $(document).on('click', '[data-' + PLUGIN_NAME + '-target]', function(e) {
      e.preventDefault();

      var elem = e.currentTarget;
      var id = elem.getAttribute('data-' + PLUGIN_NAME + '-target');
      var $target = $('[data-' + PLUGIN_NAME + '-id=' + id + ']');

      $[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open();
    });

    // Auto initialization of modal windows.
    // They should have the 'remodal' class attribute.
    // Also you can write `data-remodal-options` attribute to pass params into the modal.
    $(document).find('.' + NAMESPACE).each(function(i, container) {
      var $container = $(container);
      var options = $container.data(PLUGIN_NAME + '-options');

      if (!options) {
        options = {};
      } else if (typeof options === 'string' || options instanceof String) {
        options = parseOptions(options);
      }

      $container[PLUGIN_NAME](options);
    });
  });

  /**
   * Hashchange handler
   * @private
   * @param {Event} e
   * @param {Boolean} [closeOnEmptyHash=true]
   */
  function hashHandler(e, closeOnEmptyHash) {
    var id = location.hash.replace('#', '');
    var instance;
    var $elem;

    if (typeof closeOnEmptyHash === 'undefined') {
      closeOnEmptyHash = true;
    }

    if (!id) {
      if (closeOnEmptyHash) {

        // Check if we have currently opened modal and animation was completed
        if (current && current.state === STATES.OPENED && current.settings.hashTracking) {
          current.close();
        }
      }
    } else {

      // Catch syntax error if your hash is bad
      try {
        $elem = $(
          '[data-' + PLUGIN_NAME + '-id=' +
          id.replace(new RegExp('/', 'g'), '\\/') + ']'
        );
      } catch (err) {}

      if ($elem && $elem.length) {
        instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];

        if (instance && instance.settings.hashTracking) {
          instance.open();
        }
      }

    }
  }

  $(window).bind('hashchange.' + NAMESPACE, hashHandler);

});
