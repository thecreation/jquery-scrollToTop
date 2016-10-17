/**
* jQuery scrollToTop v0.4.2
* https://github.com/amazingSurge/jquery-scrollToTop
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryScrollToTopEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

    var DEFAULTS = {
      distance: 200,
      speed: 1000,
      easing: 'linear',
      animation: 'fade', // fade, slide, none
      animationSpeed: 500,

      mobile: {
        width: 768,
        distance: 100,
        speed: 1000,
        easing: 'easeInOutElastic',
        animation: 'slide',
        animationSpeed: 200
      },

      trigger: null, // Set a custom triggering element. Can be an HTML string or jQuery object
      target: null, // Set a custom target element for scrolling to. Can be element or number
      text: 'Scroll To Top', // Text for element, can contain HTML

      skin: null,
      throttle: 250,

      namespace: 'scrollToTop'
    };

    function transition() {
      var e = void 0;
      var end = void 0;
      var prefix = '';
      var supported = false;
      var el = document.createElement("fakeelement");

      var transitions = {
        "WebkitTransition": "webkitTransitionEnd",
        "MozTransition": "transitionend",
        "OTransition": "oTransitionend",
        "transition": "transitionend"
      };

      for (e in transitions) {

        if (el.style[e] !== undefined) {
          end = transitions[e];
          supported = true;
          break;
        }
      }

      if (/(WebKit)/i.test(window.navigator.userAgent)) {
        prefix = '-webkit-';
      }

      return {
        prefix: prefix,
        end: end,
        supported: supported
      };
    }

    function throttle(func, wait) {
      var _this = this;

      var _now = Date.now ||

      function() {
        return new Date().getTime();
      };

      var timeout = void 0;
      var context = void 0;
      var args = void 0;
      var result = void 0;
      var previous = 0;
      var later = function later() {
        previous = _now();
        timeout = null;
        result = func.apply(context, args);

        if (!timeout) {
          context = args = null;
        }
      };

      return function() {
        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        /*eslint consistent-this: "off"*/
        var now = _now();
        var remaining = wait - (now - previous);
        context = _this;
        args = params;

        if (remaining <= 0 || remaining > wait) {

          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);

          if (!timeout) {
            context = args = null;
          }
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }

        return result;
      };
    }

    /**
     * Plugin constructor
     **/

    var ScrollToTop = function() {
      function ScrollToTop() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ScrollToTop);

        this.$doc = (0, _jquery2.default)('body');
        this.options = _jquery2.default.extend(true, {}, DEFAULTS, options);

        var namespace = this.options.namespace;

        if (this.options.skin === null) {
          this.options.skin = 'default';
        }

        this.classes = {
          skin: namespace + '_' + this.options.skin,
          trigger: namespace,
          animating: namespace + '_animating',
          show: namespace + '_show'
        };

        this.disabled = false;
        this.useMobile = false;
        this.isShow = false;

        this._init();
      }

      _createClass(ScrollToTop, [{
        key: '_init',
        value: function _init() {
          this.transition = transition();
          this._build();

          if (this.options.target) {

            if (typeof this.options.target === 'number') {
              this.target = this.options.target;
            } else if (typeof this.options.target === 'string') {
              this.target = Math.floor((0, _jquery2.default)(this.options.target).offset().top);
            }
          } else {
            this.target = 0;
          }

          this._bindEvents();

          this._toggle();
        }
      }, {
        key: '_bindEvents',
        value: function _bindEvents() {
          var _this2 = this;

          this.$trigger.on('click.scrollToTop',

            function() {
              _this2.$doc.trigger('ScrollToTop::jump');

              return false;
            }
          );

          // bind events
          this.$doc.on('ScrollToTop::jump',

            function() {
              if (_this2.disabled) {

                return;
              }

              _this2.checkMobile();

              var speed = void 0;
              var easing = void 0;

              if (_this2.useMobile) {
                speed = _this2.options.mobile.speed;
                easing = _this2.options.mobile.easing;
              } else {
                speed = _this2.options.speed;
                easing = _this2.options.easing;
              }

              _this2.$doc.addClass(_this2.classes.animating);

              if (_this2.transition.supported) {
                var pos = (0, _jquery2.default)(window).scrollTop();

                _this2.$doc.css({
                  'margin-top': -pos + _this2.target + 'px'
                });
                (0, _jquery2.default)(window).scrollTop(_this2.target);

                _this2._insertRule('.duration_' + speed + '{' + _this2.transition.prefix + 'transition-duration: ' + speed + 'ms;}');

                _this2.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
                  'margin-top': ''
                }).one(_this2.transition.end,

                  function() {
                    _this2.$doc.removeClass(_this2.classes.animating + ' easing_' + easing + ' duration_' + speed);
                  }
                );
              } else {
                (0, _jquery2.default)('html, body').stop(true, false).animate({
                  scrollTop: _this2.target
                }, speed,

                  function() {
                    _this2.$doc.removeClass(_this2.classes.animating);
                  }
                );

                return;
              }
            }
          ).on('ScrollToTop::show',

            function() {
              if (_this2.isShow) {

                return;
              }
              _this2.isShow = true;

              _this2.$trigger.addClass(_this2.classes.show);
            }
          ).on('ScrollToTop::hide',

            function() {
              if (!_this2.isShow) {

                return;
              }
              _this2.isShow = false;
              _this2.$trigger.removeClass(_this2.classes.show);
            }
          ).on('ScrollToTop::disable',

            function() {
              _this2.disabled = true;
              _this2.$doc.trigger('ScrollToTop::hide');
            }
          ).on('ScrollToTop::enable',

            function() {
              _this2.disabled = false;
              _this2._toggle();
            }
          );

          (0, _jquery2.default)(window).on('scroll.ScrollToTop', throttle(

            function() {
              if (_this2.disabled) {

                return;
              }

              _this2._toggle();
            }
            , this.options.throttle));

          if (this.options.mobile) {
            (0, _jquery2.default)(window).on('resize.ScrollToTop orientationchange.ScrollToTop', throttle(

              function() {
                if (_this2.disabled) {

                  return;
                }

                _this2.checkMobile();
              }
              , this.options.throttle));
          }
        }
      }, {
        key: '_build',
        value: function _build() {
          if (this.options.trigger) {
            this.$trigger = (0, _jquery2.default)(this.options.trigger);
          } else {
            this.$trigger = (0, _jquery2.default)('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo((0, _jquery2.default)('body'));
          }

          this._insertRule('.' + this.classes.show + '{' + this.transition.prefix + 'animation-duration: ' + this.options.animationSpeed + 'ms;' + this.transition.prefix + 'animation-name: ' + this.options.namespace + '_' + this.options.animation + ';}');

          if (this.options.mobile) {
            this._insertRule('@media (max-width: ' + this.options.mobile.width + 'px){.' + this.classes.show + '{' + this.transition.prefix + 'animation-duration: ' + this.options.mobile.animationSpeed + 'ms !important;' + this.transition.prefix + 'animation-name: ' + this.options.namespace + '_' + this.options.mobile.animation + '  !important;}}');
          }
        }
      }, {
        key: 'checkMobile',
        value: function checkMobile() {
          var width = (0, _jquery2.default)(window).width();

          if (width < this.options.mobile.width) {
            this.useMobile = true;
          } else {
            this.useMobile = false;
          }
        }
      }, {
        key: 'can',
        value: function can() {
          var distance = void 0;

          if (this.useMobile) {
            distance = this.options.mobile.distance;
          } else {
            distance = this.options.distance;
          }

          if ((0, _jquery2.default)(window).scrollTop() > distance) {

            return true;
          }

          return false;
        }
      }, {
        key: '_toggle',
        value: function _toggle() {
          if (this.can()) {
            this.$doc.trigger('ScrollToTop::show');
          } else {
            this.$doc.trigger('ScrollToTop::hide');
          }
        }
      }, {
        key: '_insertRule',
        value: function _insertRule(rule) {
          if (this.rules && this.rules[rule]) {

            return;
          } else if (this.rules === undefined) {
            this.rules = {};
          } else {
            this.rules[rule] = true;
          }

          if (document.styleSheets && document.styleSheets.length) {
            document.styleSheets[0].insertRule(rule, 0);
          } else {
            var style = document.createElement('style');
            style.innerHTML = rule;
            document.head.appendChild(style);
          }
        }
      }, {
        key: 'jump',
        value: function jump() {
          this.$doc.trigger('ScrollToTop::jump');
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.$doc.trigger('ScrollToTop::disable');
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.$doc.trigger('ScrollToTop::enable');
        }
      }, {
        key: 'destroy',
        value: function destroy() {
          this.$trigger.remove();
          this.$doc.data('ScrollToTop', null);
          this.$doc.off('ScrollToTop::enable').off('ScrollToTop::disable').off('ScrollToTop::jump').off('ScrollToTop::show').off('ScrollToTop::hide');
          (0, _jquery2.default)(window).off('.ScrollToTop');
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(true, DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return ScrollToTop;
    }();

    var info = {
      version: '0.4.2'
    };

    var NAMESPACE = 'scrollToTop';
    var OtherScrollToTop = _jquery2.default.fn.scrollToTop;

    var jQueryScrollToTop = function jQueryScrollToTop(options) {
      var _this3 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)/.test(method)) {
            var instance = _this3.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this3.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

          return _ret.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new ScrollToTop(options));
          }
        }
      );
    };

    _jquery2.default.fn.scrollToTop = jQueryScrollToTop;

    _jquery2.default.scrollToTop = _jquery2.default.extend({
      setDefaults: ScrollToTop.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.scrollToTop = OtherScrollToTop;

        return jQueryScrollToTop;
      }
    }, info);
  }
);