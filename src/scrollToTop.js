import $ from 'jquery';
import DEFAULTS from './defaults';
import * as util from './util';


/**
 * Plugin constructor
 **/
class ScrollToTop {
  constructor(options = {}) {
    this.$doc = $('body');
    this.options = $.extend(true, {}, DEFAULTS, options);

    const namespace = this.options.namespace;

    if (this.options.skin === null) {
      this.options.skin = 'default';
    }

    this.classes = {
      skin: `${namespace}_${this.options.skin}`,
      trigger: namespace,
      animating: `${namespace}_animating`,
      show: `${namespace}_show`
    };

    this.disabled = false;
    this.useMobile = false;
    this.isShow = false;

    this._init();
  }

  _init() {
    this.transition = util.transition();
    this._build();

    if (this.options.target) {
      if (typeof this.options.target === 'number') {
        this.target = this.options.target;
      } else if (typeof this.options.target === 'string') {
        this.target = Math.floor($(this.options.target).offset().top);
      }
    } else {
      this.target = 0;
    }

    this._bindEvents();

    this._toggle();
  }

  _bindEvents() {
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

      let speed;
      let easing;

      if (this.useMobile) {
        speed = this.options.mobile.speed;
        easing = this.options.mobile.easing;
      } else {
        speed = this.options.speed;
        easing = this.options.easing;
      }

      this.$doc.addClass(this.classes.animating);

      if (this.transition.supported) {
        const pos = $(window).scrollTop();

        this.$doc.css({
          'margin-top': `${-pos + this.target}px`
        });
        $(window).scrollTop(this.target);

        this._insertRule(`.duration_${speed}{${this.transition.prefix}transition-duration: ${speed}ms;}`);

        this.$doc.addClass(`easing_${easing} duration_${speed}`).css({
          'margin-top': ''
        }).one(this.transition.end, () => {
          this.$doc.removeClass(`${this.classes.animating} easing_${easing} duration_${speed}`);
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
      })
      .on('ScrollToTop::disable', () => {
        this.disabled = true;
        this.$doc.trigger('ScrollToTop::hide');
      })
      .on('ScrollToTop::enable', () => {
        this.disabled = false;
        this._toggle();
      });

    $(window).on('scroll.ScrollToTop', util.throttle(() => {
      if (this.disabled) {
        return;
      }

      this._toggle();
    }, this.options.throttle));

    if (this.options.mobile) {
      $(window).on('resize.ScrollToTop orientationchange.ScrollToTop', util.throttle(() => {
        if (this.disabled) {
          return;
        }

        this.checkMobile();
      }, this.options.throttle));
    }
  }

  _build() {
    if (this.options.trigger) {
      this.$trigger = $(this.options.trigger);
    } else {
      this.$trigger = $(`<a href="#" class="${this.classes.trigger} ${this.classes.skin}">${this.options.text}</a>`).appendTo($('body'));
    }

    this._insertRule(`.${this.classes.show}{${this.transition.prefix}animation-duration: ${this.options.animationSpeed}ms;${this.transition.prefix}animation-name: ${this.options.namespace}_${this.options.animation};}`);

    if (this.options.mobile) {
      this._insertRule(`@media (max-width: ${this.options.mobile.width}px){.${this.classes.show}{${this.transition.prefix}animation-duration: ${this.options.mobile.animationSpeed}ms !important;${this.transition.prefix}animation-name: ${this.options.namespace}_${this.options.mobile.animation}  !important;}}`);
    }
  }

  checkMobile() {
    const width = $(window).width();

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
    }
    return false;
  }

  _toggle() {
    if (this.can()) {
      this.$doc.trigger('ScrollToTop::show');
    } else {
      this.$doc.trigger('ScrollToTop::hide');
    }
  }

  _insertRule(rule) {
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
      const style = document.createElement('style');
      style.innerHTML = rule;
      document.head.appendChild(style);
    }
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
    this.$doc.data('ScrollToTop', null);
    this.$doc.off('ScrollToTop::enable')
      .off('ScrollToTop::disable')
      .off('ScrollToTop::jump')
      .off('ScrollToTop::show')
      .off('ScrollToTop::hide');
    $(window).off('.ScrollToTop');
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

export default ScrollToTop;
