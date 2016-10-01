import $ from 'jquery';
import ScrollToTop from './scrollToTop';
import info from './info';

const NAMESPACE = 'scrollToTop';
const OtherScrollToTop = $.fn.scrollToTop;

const jQueryScrollToTop = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new ScrollToTop(options));
    }
  });
};

$.fn.scrollToTop = jQueryScrollToTop;

$.scrollToTop = $.extend({
  setDefaults: ScrollToTop.setDefaults,
  noConflict: function() {
    $.fn.scrollToTop = OtherScrollToTop;
    return jQueryScrollToTop;
  }
}, info);
