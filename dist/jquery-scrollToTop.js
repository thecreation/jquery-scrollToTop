/*! jQuery scrollToTop - v0.2.0 - 2013-08-26
* https://github.com/amazingSurge/jquery-scrollToTop
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
	'use strict';

	// Constructor
	var ScrollToTop = function(options) {
		this.$doc = $('body');
		this.options = $.extend(ScrollToTop.defaults, options);

		this.namespace = this.options.namespace;
		this.easing = 'easing_' + this.options.easing;
		this.skin = this.namespace + '_' + this.options.skin;
		this.disabled = false;
		this.sheet = document.styleSheets[document.styleSheets.length - 1];

		var self = this;
		$.extend(self, {
			init: function() {
				self.build();

				self.$doc.on('click.scrollToTop', '#' + self.namespace, function() {
					self.$doc.trigger('ScrollToTop::jump');
					return false;
				});

				// bind events
				self.$doc.on('ScrollToTop::jump', function() {
					if (self.disabled) {
						return;
					}
					var pos = $(window).scrollTop();
					self.$doc.css({
						'margin-top': -pos + 'px'
					});

					$(window).scrollTop(0);
					self.insertRule(self.sheet, '.' + self.easing, '-webkit-transition-duration: ' + self.options.speed + 'ms; transition-duration: ' + self.options.speed + 'ms;', 0);
					self.$doc.addClass(self.easing).css({
						'margin-top': ''
					});
				})
				.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
					self.$doc.removeClass(self.easing);
				})
				.on('ScrollToTop::show', function() {
					self.$doc.addClass(self.namespace + '_show');

					self.$trigger.addClass(self.namespace + '_' + self.options.animation);
				})
				.on('ScrollToTop::hide', function() {
					self.$doc.removeClass(self.namespace + '_show');

					self.$trigger.removeClass(self.namespace + '_' + self.options.animation);
				})
				.on('ScrollToTop::disable', function() {
					self.disabled = true;
					self.$doc.trigger('ScrollToTop::hide');
				})
				.on('ScrollToTop::enable', function() {
					self.disabled = false;

					self.toggle();
				});

				self.toggle();
			},
			build: function() {
				self.$trigger = $('<a href="#" id="' + self.namespace + '" class="' + self.namespace + ' ' + self.skin + '">' + self.options.text + '</a>').appendTo($('body'));
				self.insertRule(self.sheet, '.' + self.namespace + '_' + self.options.animation, '-webkit-animation-duration: ' + self.options.animationSpeed + 'ms; animation-duration: ' + self.options.animationSpeed + 'ms;', 0);
			},
			can: function() {
				if ($(window).scrollTop() > self.options.distance) {
					return true;
				} else {
					return false;
				}
			},
			toggle: function() {
				if (self.can()) {
					self.$doc.trigger('ScrollToTop::show');
				} else {
					self.$doc.trigger('ScrollToTop::hide');
				}
			},
			insertRule: function(sheet, selectorText, cssText, position) {
				if (sheet.insertRule) {
					sheet.insertRule(selectorText + "{" + cssText + "}", position);
				} else if (sheet.addRule) {
					sheet.addRule(selectorText, cssText, position);
				}
			}
		});

		$(window).scroll(function() {
			if (self.disabled) {
				return;
			}
			self.toggle();
		});

		this.init();
	};

	// Default options
	ScrollToTop.defaults = {
		speed: 1000,
		easing: 'linear',
		distance: 200,
		text: 'Scroll To Top',
		animation: 'fade', // fade, slide, none
		animationSpeed: 500,
		skin: null,
		namespace: 'scrollToTop'
	};

	ScrollToTop.prototype = {
		constructor: ScrollToTop,
		jump: function() {
			this.$doc.trigger('ScrollToTop::jump');
		},
		disable: function() {
			this.$doc.trigger('ScrollToTop::disable');
		},
		enable: function() {
			this.$doc.trigger('ScrollToTop::enable');
		},
		destroy: function() {
			this.$trigger.remove();
			this.$doc.data('ScrollToTop', null);
			this.$doc.off('ScrollToTop::enable');
			this.$doc.off('ScrollToTop::disable');
			this.$doc.off('ScrollToTop::jump');
			this.$doc.off('ScrollToTop::show');
			this.$doc.off('ScrollToTop::hide');
		}
	};

	$.fn.scrollToTop = function(options) {
		if (typeof options === 'string') {
			var method = options;
			var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

			return this.each(function() {
				var api = $.data(this, 'scrollToTop');

				if (api && typeof api[method] === 'function') {
					api[method].apply(api, method_arguments);
				}
			});
		} else {
			return this.each(function() {
				var api = $.data(this, 'scrollToTop');
				if (!api) {
					api = new ScrollToTop(options);
					$.data(this, 'scrollToTop', api);
				}
			});
		}
	};
}(window, document, jQuery));
