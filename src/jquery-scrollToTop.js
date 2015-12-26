import $ from 'jQuery';

const NAME = "scrollToTop";
const DEFAULT = {
	namespace: NAME,
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
	mobileHA: false //turn on or turn off mobile hardware acceleration
}

class ScrollToTop {
	constructor(options) {
		this.$doc = $('body');
		this.options = $.extend(true, {}, DEFAULT, options);

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

	init() {
		this.build();

		if (this.options.target) {
			if (typeof this.options.target === 'number') {
				this.$container = null;
			} else if (typeof this.options.target === 'string') {
				this.target =  $(this.options.target).offset().top - 20;
				this.$container = null;
			}
		} else {
			this.target = null;
			this.$container = null;
		}

		this.$trigger.on('click.scrollToTop', () => {
			this.$doc.trigger('ScrollToTop::jump');
			return false;
		});

		// bind events
		this.$doc.on('ScrollToTop::jump', () => {
				if (this.disabled) {
					return;
				}

				this.checkMobile();

				let speed, easing;

				if (this.useMobile) {
					speed = this.options.mobile.speed;
					easing = this.options.mobile.easing;
				} else {
					speed = this.options.speed;
					easing = this.options.easing;
				}
				this.$targetElement.velocity("scroll", {
					offset: this.target,
					container: this.$container,
					duration: speed,
					easing: easing,
					mobileHA: this.options.mobileHA
				});
			})
			.on('ScrollToTop::show', () => {
				if (this.isShow) {
					return;
				}
				this.isShow = true;

				let _animation,_animationSpeed;
				if (this.$doc.outerWidth() < this.options.mobile.width) {
					_animation = this.options.mobile.animation;
					_animationSpeed = this.options.mobile.animationSpeed;
				} else {
					_animation = this.options.animation;
					_animationSpeed = this.options.animationSpeed;
				}

				if (_animation === 'fade') {
					this.$trigger.velocity({
						bottom: 20
					}).velocity(`${_animation}In`, {
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
					}).velocity(`fadeIn`, {
						duration: 100
					});
				}
			})
			.on('ScrollToTop::hide', () => {
				if (!this.isShow) {
					return;
				}
				this.isShow = false;
				this.$trigger.css('opacity', '0');
				this.$trigger.velocity({
					bottom: -100
				});
				// this.$doc.attr("style", "");
			})
			.on('ScrollToTop::disable', () => {
				this.disabled = true;
				this.$doc.trigger('ScrollToTop::hide');
			})
			.on('ScrollToTop::enable', () => {
				this.disabled = false;
				this.toggle();
			});

		$(window).on('scroll.ScrollToTop', this._throttle(() => {
			if (this.disabled) {
				return;
			}
			this.toggle();
		}, this.options.throttle));

		if (this.options.mobile) {
			$(window).on('resize.ScrollToTop orientationchange.ScrollToTop', this._throttle(() => {
				if (this.disabled) {
					return;
				}

				this.checkMobile();
			}, this.options.throttle));
		}

		this.$doc.addClass(this.classes.animating);

		this.toggle();
	}

	build() {
		if (this.options.trigger) {
			this.$trigger = $(this.options.trigger);
		} else {
			this.$trigger = $('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo($('body'));
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
		if ($(window).scrollTop() > distance) {
			return true;
		} else {
			return false;
		}
	}

	toggle() {
		if (this.can()) {
			this.$doc.trigger('ScrollToTop::show');
		} else {
			console.log("run");
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
