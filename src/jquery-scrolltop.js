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

		var self = this;
		$.extend(self, {
			init: function() {
				this.prepare();

				// bind event
				self.$element.on('ScrollTop:down', function() {
					var pos = $(window).scrollTop();
					self.$element.css({
						'margin-top': -pos + 'px'
					});
					$(window).scrollTop(0);
					self.$element.addClass(self.options.easingType).addClass(self.namespace + '_margin-top');
					self.$element.trigger('ScrollTop:up');
				});
				self.$element.on('ScrollTop:up"webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd"', function() {
					self.$element.removeClass(self.options.easingType).removeClass(self.namespace + '_margin-top');
				});

				this.toggle.bind();
			},
			prepare: function() {
				if (!self.$element.has('#' + self.namespace).length) {
					self.$element.append(this.toggle.html());
				}
			},
			toggle: {
				html: function() {
					return '<a href="#" id="' + self.namespace + '" class="' + self.options.skins + '">' + self.options.txt + '</a>';
				},
				bind: function() {
					self.$toggle = self.$element.find('#' + self.namespace);

					self.$element.on('click.scrollTop', '#' + self.namespace, function() {
						self.$element.trigger('ScrollTop:down');
						return false;
					});
				}
			},
			needScrollTop: function() {
				if (self.$element.hasClass(self.namespace + '_scrolling')) {
					return true;
				} else {
					return false;
				}
			}
		});
		$(window).scroll(function() {
			if ($(window).scrollTop() > self.options.minHeight) {
				self.$element.addClass(self.namespace + '_scrolling');
				$('#' + self.namespace).fadeIn(self.options.inDelay);
			} else {
				self.$element.removeClass(self.namespace + '_scrolling');
				$('#' + self.namespace).fadeOut(self.options.outDelay);
			}
			if (self.needScrollTop()) {
				if (self.$element.has('#' + self.namespace).length) {
					self.toggle.bind();
				} else {
					self.init();
				}
			}
		});
	};

	// Default options
	ScrollTop.defaults = {
		txt: 'Scroll To Top',
		minHeight: 200,
		inDelay: 500,
		outDelay: 400,
		skins: null,
		easingType: 'easing-1',
		namespace: 'scrollTop'
	};

	ScrollTop.prototype = {
		constructor: ScrollTop,

		up: function() {
			this.$element.trigger('ScrollTop:up');
		},
		down: function() {
			this.$element.trigger('ScrollTop:down');
		},
		destroy: function() {
			this.$element.data('ScrollTop', null);
			this.$element.off('.ScrollTop');
			this.$element.off('ScrollTop:up');
			this.$element.off('ScrollTop:down');
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
