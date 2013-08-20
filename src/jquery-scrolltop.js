/*
 * scrollTop
 * https://github.com/amazingsurge/jquery-scrollTop
 *
 * Copyright (c) 2013 amazingsurge
 * Licensed under the GPL license.
 */

(function(window, document, $, undefined) {
	'use strict';

	// Constructor
	var ScrollToTop = function(element, options) {
		this.element = element;
		this.$doc = $(element);

		this.$doc = $('body');
		this.options = $.extend(ScrollToTop.defaults, options);

		this.namespace = this.options.namespace;
		this.easing = 'easing_' + this.options.easing;
		if (this.options.skin != null) {
			this.skin = this.namespace + '-img_' + this.options.skin;
		} else {
			this.skin = this.namespace + '_default';
		}
		this.disabled = false;
		

		var self = this;
		$.extend(self, {
			init: function() {
				this.build();

				self.$doc.on('click.scrollTop', '#' + self.namespace, function() {
					self.$doc.trigger('ScrollToTop::jump');
					return false;
				});

				// bind events
				self.$doc.on('ScrollToTop::jump', function() {
					if(self.disabled){
						return;
					}
					var pos = $(window).scrollTop();
					self.$doc.css({
						'margin-top': -pos + 'px'
					});

					$(window).scrollTop(0);

					self.$doc.addClass(self.easing + ' ' + self.namespace + '_jumping').css({
						'margin-top': ''
					});
				});

				self.$doc.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
					self.$doc.removeClass(self.easing + ' ' + self.namespace + '_jumping');
				});

				self.$doc.on('ScrollToTop::show', function() {
					self.$doc.addClass(self.namespace + '_show');

					self.$trigger.fadeIn(self.options.animationSpeed);
				});

				self.$doc.on('ScrollToTop::hide', function() {
					self.$doc.removeClass(self.namespace + '_show');

					self.$trigger.fadeOut(self.options.animationSpeed);
				});

				self.$doc.on('ScrollToTop::disable', function() {
					self.disabled = true;
					self.$doc.trigger('ScrollToTop::hide');
				});
				
				self.$doc.on('ScrollToTop::enable', function() {
					self.disabled = false;

					self.toggle();
				});
			},
			build: function() {
				self.$trigger = $('<a href="#" id="' + self.namespace + '" class="' + self.skin + '">' + self.options.text + '</a>').appendTo($('body'));
			},
			can: function() {
				if ($(window).scrollTop() > self.options.distance) {
					return true;
				} else {
					return false;
				}
			},
			toggle: function(){
				if (self.can()) {
					self.$doc.trigger('ScrollToTop::show');
				} else {
					self.$doc.trigger('ScrollToTop::hide');
				}
			}
		});

		$(window).scroll(function() {
			if(self.disabled){
				return;
			}
			self.toggle();
		});

		this.init();
	};

	// Default options
	ScrollToTop.defaults = {
		speed: 300,
		easing: 'linear',
		distance: 200,
		text: 'Scroll To Top',
		animation: 'fade', // fade, slide, none
		animationSpeed: 300,
		skin: null,
		namespace: 'scrollToTop'
	};

	ScrollToTop.prototype = {
		constructor: ScrollToTop,
		jump: function(){
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
			this.$doc.data('ScrollTop', null);
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
					api = new ScrollToTop(this, options);
					$.data(this, 'scrollToTop', api);
				}
			});
		}
	};
}(window, document, jQuery));
