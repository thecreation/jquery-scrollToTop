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

	var _jQuery2 = babelHelpers.interopRequireDefault(_jQuery);

	var NAME = "scrollToTop";
	var DEFAULT = {
		namespace: NAME,
		packageContainer: 'body',
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
		mobileHA: true
	};

	var ScrollToTop = (function () {
		function ScrollToTop(options) {
			babelHelpers.classCallCheck(this, ScrollToTop);
			this.options = _jQuery2.default.extend(true, {}, DEFAULT, options);
			this.$doc = (0, _jQuery2.default)(this.options.packageContainer);
			var namespace = this.options.namespace;

			if (this.options.skin === null) {
				this.options.skin = 'default';
			}

			this.classes = {
				skin: namespace + '_' + this.options.skin,
				trigger: namespace,
				show: namespace + '_show'
			};
			this.disabled = false;
			this.useMobile = false;
			this.isShow = false;
			this.$container = null;
			this.$targetElement = this.$doc;
			this.target = this.options.target;
			this.init();
		}

		babelHelpers.createClass(ScrollToTop, [{
			key: 'init',
			value: function init() {
				this.build();

				if (this.options.target) {
					if (typeof this.options.target === 'string') {
						this.$targetElement = (0, _jQuery2.default)(this.options.target);
						this.target = null;
					}
				} else {
					this.target = null;
				}

				if (this.options.packageContainer !== 'body') {
					this.$packageContainer = this.$doc;
					this.$container = this.$packageContainer;

					if (!this.options.target) {
						this.$targetElement = this.$doc.children().first();
						this.$container = this.$doc;
					}
				} else {
					this.$packageContainer = (0, _jQuery2.default)(window);
				}

				this.bindEvents();
				this.toggle();
			}
		}, {
			key: 'build',
			value: function build() {
				if (this.options.trigger) {
					this.$trigger = (0, _jQuery2.default)(this.options.trigger);
				} else {
					this.$trigger = (0, _jQuery2.default)('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo((0, _jQuery2.default)(this.options.packageContainer));
				}
			}
		}, {
			key: 'bindEvents',
			value: function bindEvents() {
				var _this = this;

				this.$trigger.on('click.scrollToTop', function () {
					_this.$doc.trigger('ScrollToTop::jump');

					return false;
				});
				this.$doc.on('ScrollToTop::jump', function () {
					if (_this.disabled) {
						return;
					}

					_this.checkMobile();

					_this.jumpAction();
				}).on('ScrollToTop::show', function () {
					if (_this.isShow) {
						return;
					}

					_this.isShow = true;

					_this.showAction();
				}).on('ScrollToTop::hide', function () {
					if (!_this.isShow) {
						return;
					}

					_this.isShow = false;

					_this.hideAction();
				}).on('ScrollToTop::disable', function () {
					_this.disabled = true;

					_this.$doc.trigger('ScrollToTop::hide');
				}).on('ScrollToTop::enable', function () {
					_this.disabled = false;

					_this.toggle();
				});
				this.$packageContainer.on('scroll.ScrollToTop', this._throttle(function () {
					if (_this.disabled) {
						return;
					}

					_this.toggle();
				}, this.options.throttle));

				if (this.options.mobile) {
					this.$packageContainer.on('resize.ScrollToTop orientationchange.ScrollToTop', this._throttle(function () {
						if (_this.disabled) {
							return;
						}

						_this.checkMobile();
					}, this.options.throttle));
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

				if (this.$packageContainer.scrollTop() > distance) {
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
		}, {
			key: 'jumpAction',
			value: function jumpAction() {
				var speed = this.options.speed,
				    easing = this.options.easing;

				if (this.useMobile) {
					speed = this.options.mobile.speed;
					easing = this.options.mobile.easing;
				}

				this.$targetElement.velocity("scroll", {
					offset: this.target,
					container: this.$container,
					duration: speed,
					easing: easing,
					mobileHA: this.options.mobileHA
				});
			}
		}, {
			key: 'showAction',
			value: function showAction() {
				var _animation = this.options.animation,
				    _animationSpeed = this.options.animationSpeed;

				if (this.useMobile) {
					_animation = this.options.mobile.animation;
					_animationSpeed = this.options.mobile.animationSpeed;
				}

				if (_animation === 'fade') {
					this.$trigger.velocity({
						bottom: 20
					}).velocity('fadeIn', {
						duration: _animationSpeed
					});
				} else if (_animation === 'slide') {
					this.$trigger.css('opacity', '1');
					this.$trigger.velocity({
						bottom: 20
					}, _animationSpeed);
				} else {
					this.$trigger.velocity({
						bottom: 20
					}).velocity('fadeIn', {
						duration: 100
					});
				}
			}
		}, {
			key: 'hideAction',
			value: function hideAction() {
				this.$trigger.css('opacity', '0');
				this.$trigger.velocity({
					bottom: -100
				});
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
								var api = _jQuery2.default.data(this, NAME);

								if (api && typeof api[method] === 'function') {
									var _api$method;

									(_api$method = api[method]).apply.apply(_api$method, [api].concat(params));
								}
							})
						};
					})();

					if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
				} else {
					return this.each(function () {
						var api = _jQuery2.default.data(this, NAME);

						if (!api) {
							api = new ScrollToTop(options);

							_jQuery2.default.data(this, NAME, api);
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
