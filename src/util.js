export function transition() {
  let e;
  let end;
  let prefix = '';
  let supported = false;
  const el = document.createElement("fakeelement");

  const transitions = {
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
    prefix,
    end,
    supported
  };
}

export function throttle(func, wait) {
  const _now = Date.now || function() {
    return new Date().getTime();
  };

  let timeout;
  let context;
  let args;
  let result;
  let previous = 0;
  let later = function() {
    previous = _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  return (...params) => {
    /*eslint consistent-this: "off"*/
    let now = _now();
    let remaining = wait - (now - previous);
    context = this;
    args = params;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
