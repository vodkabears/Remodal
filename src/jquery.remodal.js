;(function($) {
    "use strict";

    /**
     * Remodal settings
     */
    var pluginName = "remodal",
        defaults = {
            hashTracking: true,
            closeOnConfirm: true,
            closeOnCancel: true,
            closeOnEscape: true,
            closeOnAnyClick: true
        },

        // Current modal
        current,

        // Scroll position
        scrollTop;

    /**
     * Get transition duration in ms
     * @return {Number}
     */
    function getTransitionDuration($elem) {
        var duration = $elem.css("transition-duration") ||
                $elem.css("-webkit-transition-duration") ||
                $elem.css("-moz-transition-duration") ||
                $elem.css("-o-transition-duration") ||
                $elem.css("-ms-transition-duration") ||
                0,

            delay = $elem.css("transition-delay") ||
                $elem.css("-webkit-transition-delay") ||
                $elem.css("-moz-transition-delay") ||
                $elem.css("-o-transition-delay") ||
                $elem.css("-ms-transition-delay") ||
                0;

        return (parseFloat(duration) + parseFloat(delay)) * 1000;
    }

    /**
     * Get a scrollbar width
     * @return {Number}
     */
    function getScrollbarWidth() {
        if ($(document.body).height() <= $(window).height()) {
            return 0;
        }

        var outer = document.createElement("div"),
            inner = document.createElement("div"),
            widthNoScroll,
            widthWithScroll;

        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild(outer);

        widthNoScroll = outer.offsetWidth;

        // Force scrollbars
        outer.style.overflow = "scroll";

        // Add innerdiv
        inner.style.width = "100%";
        outer.appendChild(inner);

        widthWithScroll = inner.offsetWidth;

        // Remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    }

    /**
     * Lock screen
     */
    function lockScreen() {
        $(document.body).css("padding-right", "+=" + getScrollbarWidth());
        $("html, body").addClass(pluginName + "_lock");
    }

    /**
     * Unlock screen
     */
    function unlockScreen() {
        $(document.body).css("padding-right", "-=" + getScrollbarWidth());
        $("html, body").removeClass(pluginName + "_lock");
    }

    /**
     * Parse string with options
     * @param str
     * @returns {Object}
     */
    function parseOptions(str) {
        var obj = {}, arr, i, len, val;

        // Remove spaces before and after delimiters
        str = str.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",");

        // Parse string
        arr = str.split(",");
        for (i = 0, len = arr.length; i < len; i++) {
            arr[i] = arr[i].split(":");
            val = arr[i][1];

            // Convert string value if it is like a boolean
            if (typeof val === "string" || val instanceof String) {
                val = val === "true" || (val === "false" ? false : val);
            }

            // Convert string value if it is like a number
            if (typeof val === "string" || val instanceof String) {
                val = !isNaN(val) ? +val : val;
            }

            obj[arr[i][0]] = val;
        }

        return obj;
    }

    /**
     * Remodal constructor
     */
    function Remodal(modal, options) {
        this.settings = $.extend({}, defaults, options);
        this.modal = modal;
        this.buildDOM();
        this.addEventListeners();
        this.index = $[pluginName].lookup.push(this) - 1;
        this.busy = false;
    }

    /**
     * Build required DOM
     */
    Remodal.prototype.buildDOM = function() {
        var tdOverlay, tdModal, tdBg;

        this.body = $(document.body);
        this.bg = $("." + pluginName + "-bg");
        this.modalClose = $("<a href='#'>").addClass(pluginName + "-close");
        this.overlay = $("<div>").addClass(pluginName + "-overlay");

        if (!this.modal.hasClass(pluginName)) {
            this.modal.addClass(pluginName);
        }

        this.modal.css("visibility", "visible");
        this.modal.append(this.modalClose);
        this.overlay.append(this.modal);
        this.body.append(this.overlay);

        this.confirm = this.modal.find("." + pluginName + "-confirm");
        this.cancel = this.modal.find("." + pluginName + "-cancel");

        tdOverlay = getTransitionDuration(this.overlay);
        tdModal = getTransitionDuration(this.modal);
        tdBg = getTransitionDuration(this.bg);

        this.td = tdModal > tdOverlay ? tdModal : tdOverlay;
        this.td = tdBg > this.td ? tdBg : this.td;
    };

    /**
     * Add event listeners to the current modal window
     */
    Remodal.prototype.addEventListeners = function() {
        var remodal = this;

        remodal.modalClose.bind("click." + pluginName, function(e) {
            e.preventDefault();
            remodal.close();
        });

        remodal.cancel.bind("click." + pluginName, function(e) {
            e.preventDefault();
            remodal.modal.trigger("cancel");

            if (remodal.settings.closeOnCancel) {
                remodal.close();
            }
        });

        remodal.confirm.bind("click." + pluginName, function(e) {
            e.preventDefault();
            remodal.modal.trigger("confirm");

            if (remodal.settings.closeOnConfirm) {
                remodal.close();
            }
        });

        $(document).bind("keyup." + pluginName, function(e) {
            if (e.keyCode === 27 && remodal.settings.closeOnEscape) {
                remodal.close();
            }
        });

        remodal.overlay.bind("click." + pluginName, function(e) {
            var $target = $(e.target);

            if (!$target.hasClass(pluginName + "-overlay")) {
                return;
            }

            if (remodal.settings.closeOnAnyClick) {
                remodal.close();
            }
        });
    };

    /**
     * Open modal window
     */
    Remodal.prototype.open = function() {
        // Check if animation is complete
        if (this.busy) {
            return;
        }

        var remodal = this,
            id;

        remodal.busy = true;
        remodal.modal.trigger("open");

        id = remodal.modal.attr("data-" + pluginName + "-id");

        if (id && remodal.settings.hashTracking) {
            scrollTop = $(window).scrollTop();
            location.hash = id;
        }

        if (current && current !== remodal) {
            current.overlay.hide();
            current.body.removeClass(pluginName + "_active");
        }

        current = remodal;

        lockScreen();
        remodal.overlay.show();

        setTimeout(function() {
            remodal.body.addClass(pluginName + "_active");

            setTimeout(function() {
                remodal.busy = false;
                remodal.modal.trigger("opened");
            }, remodal.td + 50);
        }, 25);
    };

    /**
     * Close modal window
     */
    Remodal.prototype.close = function() {
        // Check if animation is complete
        if (this.busy) {
            return;
        }

        this.busy = true;
        this.modal.trigger("close");

        var remodal = this;

        if (remodal.settings.hashTracking &&
            remodal.modal.attr("data-" + pluginName + "-id") === location.hash.substr(1)) {
            location.hash = "";
            $(window).scrollTop(scrollTop);
        }

        remodal.body.removeClass(pluginName + "_active");

        setTimeout(function() {
            remodal.overlay.hide();
            unlockScreen();

            remodal.busy = false;
            remodal.modal.trigger("closed");
        }, remodal.td + 50);
    };

    /**
     * Special plugin object for instances.
     * @type {Object}
     */
    $[pluginName] = {
        lookup: []
    };

    /**
     * Plugin constructor
     * @param {Object} options
     * @returns {JQuery}
     * @constructor
     */
    $.fn[pluginName] = function(opts) {
        var instance, $elem;

        this.each(function(index, elem) {
            $elem = $(elem);

            if ($elem.data(pluginName) == null) {
                instance = new Remodal($elem, opts);
                $elem.data(pluginName, instance.index);

                if (instance.settings.hashTracking &&
                    $elem.attr("data-" + pluginName + "-id") === location.hash.substr(1)) {
                    instance.open();
                }
            }
        });

        return instance;
    };

    $(document).ready(function() {
        /**
         * data-remodal-target opens a modal window with a special id without hash change.
         */
        $(document).on("click", "[data-" + pluginName + "-target]", function(e) {
            e.preventDefault();

            var elem = e.currentTarget,
                id = elem.getAttribute("data-" + pluginName + "-target"),
                $target = $("[data-" + pluginName + "-id=" + id + "]");

            $[pluginName].lookup[$target.data(pluginName)].open();
        });

        /**
         * Auto initialization of modal windows.
         * They should have the 'remodal' class attribute.
         * Also you can pass params into the modal throw the data-remodal-options attribute.
         * data-remodal-options must be a valid JSON string.
         */
        $(document).find("." + pluginName).each(function(i, container) {
            var $container = $(container),
                options = $container.data(pluginName + "-options");

            if (!options) {
                options = {};
            } else if (typeof options === "string" || options instanceof String) {
                options = parseOptions(options);
            }

            $container[pluginName](options);
        });
    });

    /**
     * Hashchange handling to show a modal with a special id.
     */
    function hashHandler(e, closeOnEmptyHash) {
        var id = location.hash.replace("#", ""),
            $elem, instance;

        if (typeof closeOnEmptyHash === "undefined") {
            closeOnEmptyHash = true;
        }

        if (!id) {
            if (closeOnEmptyHash) {

                // Check if we have currently opened modal and animation is complete
                if (current && !current.busy && current.settings.hashTracking) {
                    current.close();
                }
            }
        } else {

            // Catch syntax error if your hash is bad
            try {
                $elem = $(
                    "[data-" + pluginName + "-id=" +
                    id.replace(new RegExp("/", "g"), "\\/") + "]"
                );
            } catch (err) {}

            if ($elem && $elem.length) {
                instance = $[pluginName].lookup[$elem.data(pluginName)];

                if (instance && instance.settings.hashTracking) {
                    instance.open();
                }
            }

        }
    }
    $(window).bind("hashchange." + pluginName, hashHandler);
})(window.jQuery || window.Zepto);
