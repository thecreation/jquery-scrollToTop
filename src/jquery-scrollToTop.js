import $ from 'jQuery';

const NAME = "scrollToTop";
const DEFAULT = {
	namespace: NAME,
	packageContainer: 'body', // must set "height" attribute
	distance: 200,
	speed: 1000,
	easing: 'linear',
	animation: 'fade', // fade, slide, none
	animationSpeed: 500,

	mobile: {
		width: 768,
		distance: 100,
		speed: 1000,
		easing: 'spring',
		animation: 'slide',
		animationSpeed: 200
	},

	trigger: null, // Set a custom triggering element. Can be an HTML string or jQuery object
	target: null, // Set a custom target element for scrolling to. Can be element or number
	text: 'Scroll To Top', // Text for element, can contain HTML

	skin: null,
	throttle: 250,
	mobileHA: true //turn on or turn off mobile hardware acceleration
}

class ScrollToTop {
	constructor(options) {
		this.options = $.extend(true, {}, DEFAULT, options);
		this.$doc = $(this.options.packageContainer);
		let namespace = this.options.namespace;

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

	init() {
		this.build();

		if (this.options.target) {
			if (typeof this.options.target === 'string') {
				this.$targetElement = $(this.options.target);
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
			this.$packageContainer = $(window);
		}

		this.bindEvents();
		this.toggle();
	}

	build() {
		if (this.options.trigger) {
			this.$trigger = $(this.options.trigger);
		} else {
			this.$trigger = $('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo($(this.options.packageContainer));
		}
	}

	bindEvents() {
		this.$trigger.on('click.scrollToTop', () => {
			this.$doc.trigger('ScrollToTop::jump');
			return false;
		});

		this.$doc.on('ScrollToTop::jump', () => {
				if (this.disabled) {
					return;
				}
				this.checkMobile();
				this.jumpAction();
			})
			.on('ScrollToTop::show', () => {
				if (this.isShow) {
					return;
				}
				this.isShow = true;
				this.showAction();
			})
			.on('ScrollToTop::hide', () => {
				if (!this.isShow) {
					return;
				}
				this.isShow = false;
				this.hideAction();
			})
			.on('ScrollToTop::disable', () => {
				this.disabled = true;
				this.$doc.trigger('ScrollToTop::hide');
			})
			.on('ScrollToTop::enable', () => {
				this.disabled = false;
				this.toggle();
			});

		this.$packageContainer.on('scroll.ScrollToTop', this._throttle(() => {
			if (this.disabled) {
				return;
			}
			this.toggle();
		}, this.options.throttle));

		if (this.options.mobile) {
			this.$packageContainer.on('resize.ScrollToTop orientationchange.ScrollToTop', this._throttle(() => {
				if (this.disabled) {
					return;
				}
				this.checkMobile();
			}, this.options.throttle));
		}
	}

	checkMobile() {
		let width = $(window).width();

		if (width < this.options.mobile.width) {
			this.useMobile = true;
		} else {
			this.useMobile = false;
		}
	}

	can() {
		let distance;
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

	toggle() {
		if (this.can()) {
			this.$doc.trigger('ScrollToTop::show');
		} else {
			this.$doc.trigger('ScrollToTop::hide');
		}
	}

	/**
	 * _throttle
	 * @description Borrowed from Underscore.js
	 */
	_throttle(func, wait) {
		let _now = Date.now || function () {
			return new Date().getTime();
		};
		let context, args, result;
		let timeout = null;
		let previous = 0;
		let later = () => {
			previous = _now();
			timeout = null;
			result = func.apply(context, args);
			context = args = null;
		};
		return () => {
			let now = _now();
			let remaining = wait - (now - previous);
			context = this;
			args = arguments;
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

	jump() {
		this.$doc.trigger('ScrollToTop::jump');
	}

	disable() {
		this.$doc.trigger('ScrollToTop::disable');
	}

	enable() {
		this.$doc.trigger('ScrollToTop::enable');
	}

	destroy() {
		this.$trigger.remove();
		this.$doc.data(NAME, null);
		this.$doc.off('ScrollToTop::enable')
			.off('ScrollToTop::disable')
			.off('ScrollToTop::jump')
			.off('ScrollToTop::show')
			.off('ScrollToTop::hide');
		$(window).off('.ScrollToTop');
	}

	jumpAction() {
		let speed = this.options.speed,
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

	showAction() {
		let _animation = this.options.animation,
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

	hideAction() {
		this.$trigger.css('opacity', '0');
		this.$trigger.velocity({
			bottom: -100
		});
	}

	static _jQueryInterface(options, ...params) {
		"use strict";
		if (typeof options === 'string') {
			let method = options;

			return this.each(() => {
				let api = $.data(this, NAME);

				if (api && typeof api[method] === 'function') {
					api[method].apply(api, ...params);
				}
			});
		} else {
			return this.each(() => {
				let api = $.data(this, NAME);
				if (!api) {
					api = new ScrollToTop(options);
					$.data(this, NAME, api);
				}
			});
		}
	}
}

$.fn[NAME] = ScrollToTop._jQueryInterface;
$.fn[NAME].constructor = ScrollToTop;
$.fn[NAME].noConflict = () => {
	$.fn[NAME] = JQUERY_NO_CONFLICT
	return ScrollToTop._jQueryInterface
};

export default ScrollToTop;
