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
	var ScrollTop = function(element, options) {
		this.element = element;
		this.$element = $(element);
		this.options = $.extend(ScrollTop.defaults, options);

		this.namespace = this.options.namespace;
		this.easingType = 'easing_' + this.options.easingType;
		if (this.options.skin != null) {
			this.skin = this.namespace + '-img_' + this.options.skin;
		} else {
			this.skin = this.namespace + '_default';
		}

		var self = this;
		$.extend(self, {
			init: function() {
				this.prepare();

				// bind event
				self.$element.on('ScrollTop:active', function() {
					var pos = $(window).scrollTop();
					self.$element.css({
						'margin-top': -pos + 'px'
					});
					$(window).scrollTop(0);
					self.$element.css({
						'margin-top': '0'
					}).addClass(self.easingType);
					self.$element.trigger('ScrollTop:inactive');
				});
				self.$element.on('ScrollTop:inactive[webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd]', function() {
					self.$element.removeClass(self.easingType);
				});

				this.bind();
			},
			prepare: function() {
				if (!self.$element.find('#' + self.namespace).length) {
					self.$element.append('<a href="#" id="' + self.namespace + '" class="' + self.skin + '">' + self.options.text + '</a>');
				}
			},
			bind: function() {
				self.$toggle = self.$element.find('#' + self.namespace);

				self.$element.on('click.scrollTop', '#' + self.namespace, function() {
					self.$element.trigger('ScrollTop:active');
					return false;
				});
			},
			needScrollTop: function() {
				if ($(window).scrollTop() > self.options.minHeight) {
					self.$element.addClass(self.namespace + '_scrolling');
					$('#' + self.namespace).fadeIn(self.options.inDelay);
					return true;
				} else {
					self.$element.removeClass(self.namespace + '_scrolling');
					$('#' + self.namespace).fadeOut(self.options.outDelay);
					return false;
				}
			}
		});
		if (self.needScrollTop()) {
			if (this.$element.find('#' + self.namespace).length) {
				self.bind();
			} else {
				self.init();
			}
		}
		$(window).scroll(function() {
			if (self.needScrollTop()) {
				if (self.$element.find('#' + self.namespace).length) {
					self.bind();
				} else {
					self.init();
				}
			}
		});
	};

	// Default options
	ScrollTop.defaults = {
		text: 'Scroll To Top',
		minHeight: 200,
		inDelay: 500,
		outDelay: 400,
		skin: null,
		easingType: 'linear',
		namespace: 'scrollTop'
	};

	ScrollTop.prototype = {
		constructor: ScrollTop,

		disable: function() {
			this.$element.trigger('ScrollTop:inactive');
		},
		enable: function() {
			this.$element.trigger('ScrollTop:active');
		},
		destroy: function() {
			this.$element.data('ScrollTop', null);
			this.$element.off('#ScrollTop');
			this.$element.off('ScrollTop:inactive');
			this.$element.off('ScrollTop:active');
		}
	};

	$.fn.ScrollTop = function(options) {
		if (typeof options === 'string') {
			var method = options;
			var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

			return this.each(function() {
				var api = $.data(this, 'scrollTop');
				if (api && typeof api[method] === 'function') {
					api[method].apply(api, method_arguments);
				}
			});
		} else {
			return this.each(function() {
				var api = $.data(this, 'scrollTop');
				if (!api) {
					api = new ScrollTop(this, options);
					$.data(this, 'scrollTop', api);
				}
			});
		}
	};
}(window, document, jQuery));
