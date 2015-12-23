'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'jQuery'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('jQuery'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.jQuery);
		global.jqueryScrollToTop = mod.exports;
	}
})(this, function (exports, _jQuery) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jQuery2 = _interopRequireDefault(_jQuery);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _typeof(obj) {
		return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = (function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	})();

	var NAME = "scrollToTop";
	var DEFAULT = {
		namespace: NAME,
		distance: 200,
		speed: 1000,
		easing: 'linear',
		animation: 'fade',
		animationSpeed: 500,
		mobile: {
			width: 768,
			distance: 100,
			speed: 1000,
			easing: 'easeInOutElastic',
			animation: 'slide',
			animationSpeed: 200
		},
		trigger: null,
		target: null,
		text: 'Scroll To Top',
		skin: null,
		throttle: 250
	};

	var ScrollToTop = (function () {
		function ScrollToTop(options) {
			_classCallCheck(this, ScrollToTop);

			this.$doc = (0, _jQuery2.default)('body');
			this.options = _jQuery2.default.extend(true, {}, DEFAULT, options);

			if (this.options.skin === null) {
				this.options.skin = 'default';
			}

			this.classes = {
				skin: NAME + '_' + this.options.skin,
				trigger: NAME,
				animating: NAME + '_animating',
				show: NAME + '_show'
			};
			this.disabled = false;
			this.useMobile = false;
			this.isShow = false;
			this.init();
		}

		_createClass(ScrollToTop, [{
			key: 'init',
			value: function init() {
				var _this = this;

				this.transition = this.transition();
				this.build();

				if (this.options.target) {
					if (typeof this.options.target === 'number') {
						this.target = this.options.target;
					} else if (typeof this.options.target === 'string') {
						this.target = Math.floor((0, _jQuery2.default)(this.options.target).offset().top);
					}
				} else {
					this.target = 0;
				}

				this.$trigger.on('click.scrollToTop', function () {
					_this.$doc.trigger('ScrollToTop::jump');

					return false;
				});
				this.$doc.on('ScrollToTop::jump', function () {
					if (_this.disabled) {
						return;
					}

					_this.checkMobile();

					var speed = undefined,
					    easing = undefined;

					if (_this.useMobile) {
						speed = _this.options.mobile.speed;
						easing = _this.options.mobile.easing;
					} else {
						speed = _this.options.speed;
						easing = _this.options.easing;
					}

					_this.$doc.addClass(_this.classes.animating);

					if (_this.transition.supported) {
						var pos = (0, _jQuery2.default)(window).scrollTop();

						_this.$doc.css({
							'margin-top': -pos + _this.target + 'px'
						});

						(0, _jQuery2.default)(window).scrollTop(_this.target);

						_this.$doc.attr("style", _this.transition.prefix + 'transition-duration:' + speed + 'ms');

						_this.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
							'margin-top': ''
						}).one(_this.transition.end, function () {
							_this.$doc.removeClass(_this.classes.animating + ' easing_' + easing + ' duration_' + speed);
						});
					} else {
						(0, _jQuery2.default)('html, body').stop(true, false).animate({
							scrollTop: _this.target
						}, speed, function () {
							_this.$doc.removeClass(_this.classes.animating);
						});
						return;
					}
				}).on('ScrollToTop::show', function () {
					if (_this.isShow) {
						return;
					}

					_this.isShow = true;

					_this.$trigger.addClass(_this.classes.show);
				}).on('ScrollToTop::hide', function () {
					if (!_this.isShow) {
						return;
					}

					_this.isShow = false;

					_this.$trigger.removeClass(_this.classes.show);

					_this.$doc.attr("style", "");
				}).on('ScrollToTop::disable', function () {
					_this.disabled = true;

					_this.$doc.trigger('ScrollToTop::hide');
				}).on('ScrollToTop::enable', function () {
					_this.disabled = false;

					_this.toggle();
				});
				(0, _jQuery2.default)(window).on('scroll.ScrollToTop', this._throttle(function () {
					if (_this.disabled) {
						return;
					}

					_this.toggle();
				}, this.options.throttle));

				if (this.options.mobile) {
					(0, _jQuery2.default)(window).on('resize.ScrollToTop orientationchange.ScrollToTop', this._throttle(function () {
						if (_this.disabled) {
							return;
						}

						_this.checkMobile();
					}, this.options.throttle));
				}

				this.toggle();
			}
		}, {
			key: 'build',
			value: function build() {
				if (this.options.trigger) {
					this.$trigger = (0, _jQuery2.default)(this.options.trigger);
				} else {
					this.$trigger = (0, _jQuery2.default)('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo((0, _jQuery2.default)('body'));
				}

				this.insertRule('.' + this.classes.show + ' {' + this.transition.prefix + 'animation-duration:' + this.options.animationSpeed + 'ms; ' + this.transition.prefix + 'animation-name:+' + this.options.namespace + '_' + this.options.animation + ' ;}');

				if (this.options.mobile) {
					this.insertRule('@media (max-width:' + this.options.mobile.width + 'px){.' + this.classes.show + '{' + this.transition.prefix + 'animation-duration: ' + this.options.mobile.animationSpeed + 'ms!important; + ' + this.transition.prefix + 'animation-name: ' + this.options.namespace + '_' + this.options.mobile.animation + '!important;}}');
				}
			}
		}, {
			key: 'checkMobile',
			value: function checkMobile() {
				var width = (0, _jQuery2.default)(window).width();

				if (width < this.options.mobile.width) {
					this.useMobile = true;
				} else {
					this.useMobile = false;
				}
			}
		}, {
			key: 'can',
			value: function can() {
				var distance = undefined;

				if (this.useMobile) {
					distance = this.options.mobile.distance;
				} else {
					distance = this.options.distance;
				}

				if ((0, _jQuery2.default)(window).scrollTop() > distance) {
					return true;
				} else {
					return false;
				}
			}
		}, {
			key: 'toggle',
			value: function toggle() {
				if (this.can()) {
					this.$doc.trigger('ScrollToTop::show');
				} else {
					this.$doc.trigger('ScrollToTop::hide');
				}
			}
		}, {
			key: 'transition',
			value: function transition() {
				var e = undefined,
				    end = undefined,
				    prefix = '',
				    supported = false,
				    el = document.createElement("fakeelement"),
				    transitions = {
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
		}, {
			key: 'insertRule',
			value: function insertRule(rule) {
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
			key: '_throttle',
			value: function _throttle(func, wait) {
				var _this2 = this,
				    _arguments = arguments;

				var _now = Date.now || function () {
					return new Date().getTime();
				};

				var context = undefined,
				    args = undefined,
				    result = undefined;
				var timeout = null;
				var previous = 0;

				var later = function later() {
					previous = _now();
					timeout = null;
					result = func.apply(context, args);
					context = args = null;
				};

				return function () {
					var now = _now();

					var remaining = wait - (now - previous);
					context = _this2;
					args = _arguments;

					if (remaining <= 0) {
						clearTimeout(timeout);
						timeout = null;
						previous = now;
						result = func.apply(context, args);
						context = args = null;
					} else if (!timeout) {
						timeout = setTimeout(later, remaining);
					}

					return result;
				};
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
				this.$doc.data(NAME, null);
				this.$doc.off('ScrollToTop::enable').off('ScrollToTop::disable').off('ScrollToTop::jump').off('ScrollToTop::show').off('ScrollToTop::hide');
				(0, _jQuery2.default)(window).off('.ScrollToTop');
			}
		}], [{
			key: '_jQueryInterface',
			value: function _jQueryInterface(options) {
				"use strict";

				var _this3 = this;

				for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					params[_key - 1] = arguments[_key];
				}

				if (typeof options === 'string') {
					var _ret = (function () {
						var method = options;
						return {
							v: _this3.each(function () {
								var api = _jQuery2.default.data(_this3, NAME);

								if (api && typeof api[method] === 'function') {
									var _api$method;

									(_api$method = api[method]).apply.apply(_api$method, [api].concat(params));
								}
							})
						};
					})();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				} else {
					return this.each(function () {
						var api = _jQuery2.default.data(_this3, NAME);

						if (!api) {
							api = new ScrollToTop(options);

							_jQuery2.default.data(_this3, NAME, api);
						}
					});
				}
			}
		}]);

		return ScrollToTop;
	})();

	_jQuery2.default.fn[NAME] = ScrollToTop._jQueryInterface;
	_jQuery2.default.fn[NAME].constructor = ScrollToTop;

	_jQuery2.default.fn[NAME].noConflict = function () {
		_jQuery2.default.fn[NAME] = JQUERY_NO_CONFLICT;
		return ScrollToTop._jQueryInterface;
	};

	exports.default = ScrollToTop;
});
