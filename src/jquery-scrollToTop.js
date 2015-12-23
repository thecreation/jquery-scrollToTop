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
		easing: 'easeInOutElastic',
		animation: 'slide',
		animationSpeed: 200
	},

	trigger: null, // Set a custom triggering element. Can be an HTML string or jQuery object
	target: null, // Set a custom target element for scrolling to. Can be element or number
	text: 'Scroll To Top', // Text for element, can contain HTML

	skin: null,
	throttle: 250
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
			animating: NAME + '_animating',
			show: NAME + '_show'
		};

		this.disabled = false;
		this.useMobile = false;
		this.isShow = false;
		this.init();
	}

	init() {
		this.transition = this.transition();
		this.build();

		if (this.options.target) {
			if (typeof this.options.target === 'number') {
				this.target = this.options.target;
			} else if (typeof this.options.target === 'string') {
				this.target = Math.floor($(this.options.target).offset().top);
			}
		} else {
			this.target = 0;
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

				this.$doc.addClass(this.classes.animating);

				if (this.transition.supported) {
					let pos = $(window).scrollTop();

					this.$doc.css({
						'margin-top': -pos + this.target + 'px'
					});
					$(window).scrollTop(this.target);

					this.$doc.attr("style", `${this.transition.prefix}transition-duration:${speed}ms`);

					this.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
						'margin-top': ''
					}).one(this.transition.end, () => {
						this.$doc.removeClass(this.classes.animating + ' easing_' + easing + ' duration_' + speed);
					});
				} else {
					$('html, body').stop(true, false).animate({
						scrollTop: this.target
					}, speed, () => {
						this.$doc.removeClass(this.classes.animating);
					});
					return;
				}
			})
			.on('ScrollToTop::show', () => {
				if (this.isShow) {
					return;
				}
				this.isShow = true;

				this.$trigger.addClass(this.classes.show);
			})
			.on('ScrollToTop::hide', () => {
				if (!this.isShow) {
					return;
				}
				this.isShow = false;
				this.$trigger.removeClass(this.classes.show);
				this.$doc.attr("style", "");
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

		this.toggle();
	}

	build() {
		if (this.options.trigger) {
			this.$trigger = $(this.options.trigger);
		} else {
			this.$trigger = $('<a href="#" class="' + this.classes.trigger + ' ' + this.classes.skin + '">' + this.options.text + '</a>').appendTo($('body'));
		}

		this.insertRule(`.${this.classes.show} {${this.transition.prefix}animation-duration:${this.options.animationSpeed}ms; ${this.transition.prefix}animation-name:+${this.options.namespace}_${this.options.animation} ;}`);

		if (this.options.mobile) {
			this.insertRule(`@media (max-width:${this.options.mobile.width}px){.${this.classes.show}{${this.transition.prefix}animation-duration: ${this.options.mobile.animationSpeed}ms!important; + ${this.transition.prefix}animation-name: ${this.options.namespace}_${this.options.mobile.animation}!important;}}`);
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
			this.$doc.trigger('ScrollToTop::hide');
		}
	}

	transition() {
		let e,
			end,
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

	insertRule(rule) {
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
			let style = document.createElement('style');
			style.innerHTML = rule;
			document.head.appendChild(style);
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
