export default {
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
  throttle: 250,

  namespace: 'scrollToTop'
};
