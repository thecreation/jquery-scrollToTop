# [jQuery scrollToTop](https://github.com/amazingSurge/jquery-scrollToTop) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that automatically add a button to scroll to top.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-scrollToTop.js
├── jquery-scrollToTop.es.js
├── jquery-scrollToTop.min.js
└── css/
    ├── scrollToTop.css
    └── scrollToTop.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-scrollToTop/master/dist/jquery-scrollToTop.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-scrollToTop/master/dist/jquery-scrollToTop.min.js) - minified

#### Install From Bower
```sh
bower install jquery-scrollToTop --save
```

#### Install From Npm
```sh
npm install jquery-scrollToTop --save
```

#### Install From Yarn
```sh
yarn add jquery-scrollToTop
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-scrollToTop.git
cd jquery-scrollToTop
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-scrollToTop` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/scrollToTop.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-scrollToTop.js"></script>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('body').scrollToTop({
    skin: 'cycle'
  });
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-scrollToTop/tree/master/examples).

## Options
`jquery-scrollToTop` can accept an options object to alter the way it behaves. You can see the default options by call `$.scrollToTop.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on scrollToTop instances through the scrollToTop method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().scrollToTop('destroy');

// or
var api = $().data('scrollToTop');
api.destroy();
```

#### jump()
Jump to top.
```javascript
$().scrollToTop('jump');
```

#### enable()
Enable the scrollbar functions.
```javascript
$().scrollToTop('enable');
```

#### disable()
Disable the scrollbar functions.
```javascript
$().scrollToTop('disable');
```

#### destroy()
Destroy the scrollbar instance.
```javascript
$().scrollToTop('destroy');
```

## Events
`jquery-scrollToTop` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('scrollToTop::jump', function (e) {
  // on jump to top
});
```

Event   | Description
------- | -----------
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
show    | Fired when showing the toggle.
hide    | Fired when hiding the toggle.
jump    | Fired when jumping to the top.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.scrollToTop.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-scrollToTop.js"></script>
<script>
  $.scrollToTop.noConflict();
  // Code that uses other plugin's "$().scrollToTop" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-scrollToTop` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-scrollToTop` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-scrollToTop/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-scrollToTop.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-scrollToTop/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-scrollToTop.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-scrollToTop
[license]: https://img.shields.io/npm/l/jquery-scrollToTop.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-scrollToTop.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-scrollToTop
