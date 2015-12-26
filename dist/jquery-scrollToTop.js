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
			easing: 'spring',
			animation: 'slide',
			animationSpeed: 200
		},
		trigger: null,
		target: null,
		text: 'Scroll To Top',
		skin: null,
		throttle: 250,
		mobileHA: false
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
				show: NAME + '_show'
			};
			this.disabled = false;
			this.useMobile = false;
			this.isShow = false;
			this.$container = this.$doc;
			this.$targetElement = this.$doc;
			this.target = this.options.target;
			this.init();
		}

		_createClass(ScrollToTop, [{
			key: 'init',
			value: function init() {
				var _this = this;

				this.build();

				if (this.options.target) {
					if (typeof this.options.target === 'number') {
						this.$container = null;
					} else if (typeof this.options.target === 'string') {
						this.target = (0, _jQuery2.default)(this.options.target).offset().top - 20;
						this.$container = null;
					}
				} else {
					this.target = null;
					this.$container = null;
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

					_this.$targetElement.velocity("scroll", {
						offset: _this.target,
						container: _this.$container,
						duration: speed,
						easing: easing,
						mobileHA: _this.options.mobileHA
					});
				}).on('ScrollToTop::show', function () {
					if (_this.isShow) {
						return;
					}

					_this.isShow = true;
					var _animation = undefined,
					    _animationSpeed = undefined;

					if (_this.$doc.outerWidth() < _this.options.mobile.width) {
						_animation = _this.options.mobile.animation;
						_animationSpeed = _this.options.mobile.animationSpeed;
					} else {
						_animation = _this.options.animation;
						_animationSpeed = _this.options.animationSpeed;
					}

					if (_animation === 'fade') {
						_this.$trigger.velocity({
							bottom: 20
						}).velocity(_animation + 'In', {
							duration: _animationSpeed
						});
					} else if (_animation === 'slide') {
						_this.$trigger.css('opacity', '1');

						_this.$trigger.velocity({
							bottom: 20
						}, _animationSpeed);
					} else {
						_this.$trigger.velocity({
							bottom: 20
						}).velocity('fadeIn', {
							duration: 100
						});
					}
				}).on('ScrollToTop::hide', function () {
					if (!_this.isShow) {
						return;
					}

					_this.isShow = false;

					_this.$trigger.css('opacity', '0');

					_this.$trigger.velocity({
						bottom: -100
					});
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

				this.$doc.addClass(this.classes.animating);
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
					console.log("run");
					this.$doc.trigger('ScrollToTop::hide');
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
