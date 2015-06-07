[![NPM version](https://img.shields.io/npm/v/remodal.svg?style=flat)](https://npmjs.org/package/remodal)
[![Bower version](https://badge.fury.io/bo/remodal.svg)](http://badge.fury.io/bo/remodal)
[![Travis](https://travis-ci.org/VodkaBears/Remodal.svg?branch=master)](https://travis-ci.org/VodkaBears/Remodal)
Remodal
=======
Responsive, lightweight, fast, synchronized with CSS animations, fully customizable modal window plugin with declarative configuration and hash tracking.

![logo](https://raw.githubusercontent.com/VodkaBears/vodkabears.github.com/master/remodal/remodal.png)

#IMPORTANT!

**v1.0.0 has a lot of incompatible changes.**

## Notes
* All modern browsers are supported.
* IE8+. To enable IE8 styles add the `lt-ie9` class to the `html` element, as modernizr does.
* jQuery, jQuery2, Zepto support.
* Browserify support.

## Start

Download the latest version from [GitHub](https://github.com/VodkaBears/Remodal/releases/latest
) or via package managers:
```
npm install remodal
bower install remodal
```

Include the CSS files from the dist folder in the head section:
```html
<link rel="stylesheet" href="../dist/remodal.css">
<link rel="stylesheet" href="../dist/remodal-default-theme.css">
```

Include the JS file from the dist folder before the `</body>`:
```html
<script src="../dist/remodal.min.js"></script>
```

You can define the background container for the modal(for effects like a blur). It can be any simple content wrapper:
```html
<div class="remodal-bg">
...Page content...
</div>
```

And now create the modal dialog:
```html
<div class="remodal" data-remodal-id="modal">
  <button data-remodal-action="close" class="remodal-close"></button>
  <h1>Remodal</h1>
  <p>
    Responsive, lightweight, fast, synchronized with CSS animations, fully customizable modal window plugin with declarative configuration and hash tracking.
  </p>
  <br>
  <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
  <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
</div>
```

Don't use the `id` attribute, if you want to avoid the anchor jump, use `data-remodal-id`.

So, now you can call it with the hash:
```html
<a href="#modal">Call the modal with data-remodal-id="modal"</a>
```
Or:
```html
<a data-remodal-target="modal">Call the modal with data-remodal-id="modal"</a>
```

## Options

You can pass additional options with the `data-remodal-options` attribute.
```html
<div class="remodal" data-remodal-id="modal"
  data-remodal-options="hashTracking: false, closeOnOutsideClick: false">

  <button data-remodal-action="close" class="remodal-close"></button>
  <h1>Remodal</h1>
  <p>
    Responsive, lightweight, fast, synchronized with CSS animations, fully customizable modal window plugin with declarative configuration and hash tracking.
  </p>
  <br>
  <button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>
  <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
</div>
```

#### hashTracking
`Default: true`

To open the modal without the hash, use the `data-remodal-target` attribute.
```html
<a data-remodal-target="modal" href="#">Call the modal with data-remodal-id="modal"</a>
```

#### closeOnConfirm
`Default: true`

If true, closes the modal window after clicking the confirm button.

#### closeOnCancel
`Default: true`

If true, closes the modal window after clicking the cancel button.

#### closeOnEscape
`Default: true`

If true, closes the modal window after pressing the ESC key.

#### closeOnOutsideClick
`Default: true`

If true, closes the modal window by clicking anywhere on the page.

#### modifier
`Default: ''`

Modifier CSS classes for the modal that is added to the overlay, modal, background and wrapper (see [CSS](#css)).

## Globals

```html
<script>
window.REMODAL_GLOBALS = {
  NAMESPACE: 'modal',
  DEFAULTS: {
    hashTracking: false
  }
};
</script>
<script src="../dist/remodal.js"></script>
```

#### NAMESPACE

Base HTML class for your modals. CSS theme should be updated to reflect this.

#### DEFAULTS

Extends the default settings.

## Initialization with JavaScript

Do not set the 'remodal' class, if you prefer a JS initialization.
```html
<div data-remodal-id="modal">
  <button data-remodal-action="close" class="remodal-close"></button>
  <h1>Remodal</h1>
  <p>
    Responsive, lightweight, fast, synchronized with CSS animations, fully customizable modal window plugin with declarative configuration and hash tracking.
  </p>
</div>
<script>
    var options = {...};

    $('[data-remodal-id=modal]').remodal(options);
</script>
```

## Methods

Get the instance of the modal and call a method:
```js
var inst = $('[data-remodal-id=modal]').remodal();

/**
 * Opens the modal window
 */
inst.open();

/**
 * Closes the modal window
 */
inst.close();

/**
 * Returns a current state of the modal
 * @returns {'closed'|'closing'|'opened'|'opening'}
 */
inst.getState();

/**
 * Destroys the modal window
 */
inst.destroy();
```

## Events

```js
$(document).on('opening', '.remodal', function () {
  console.log('Modal is opening');
});

$(document).on('opened', '.remodal', function () {
  console.log('Modal is opened');
});

$(document).on('closing', '.remodal', function (e) {

  // Reason: 'confirmation', 'cancellation'
  console.log('Modal is closing' + (e.reason ? ', reason: ' + e.reason : ''));
});

$(document).on('closed', '.remodal', function (e) {

  // Reason: 'confirmation', 'cancellation'
  console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
});

$(document).on('confirmation', '.remodal', function () {
  console.log('Confirmation button is clicked');
});

$(document).on('cancellation', '.remodal', function () {
  console.log('Cancel button is clicked');
});
```

## CSS

#### Classes

`.remodal` – the default class of modal dialogs.

`.remodal-wrapper` – the additional wrapper for the `.remodal`, it is not the overlay and used for the alignment.

`.remodal-overlay` – the overlay of modal dialogs, it is under the wrapper.

`.remodal-bg` – the background of modal dialogs, it is under the overlay and usually it is the wrapper of your content. You should add it on your own.

The `remodal` prefix can be changed in the global settings. See [the `NAMESPACE` option](#namespace).

#### States

States are added to the `.remodal`, `.remodal-overlay`, `.remodal-bg`, `.remodal-wrapper` classes.

List:
```
.remodal-is-opening
.remodal-is-opened
.remodal-is-closing
.remodal-is-closed
```

#### Modifier

A modifier that is specified in the [options](#options) is added to the `.remodal`, `.remodal-overlay`, `.remodal-bg`, `.remodal-wrapper` classes.

## License

```
The MIT License (MIT)

Copyright (c) 2015 Ilya Makarov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
