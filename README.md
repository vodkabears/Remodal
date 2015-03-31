[![Bower version](https://badge.fury.io/bo/remodal.svg)](http://badge.fury.io/bo/remodal)
[![Travis](https://travis-ci.org/VodkaBears/Remodal.svg?branch=master)](https://travis-ci.org/VodkaBears/Remodal)
[![devDependency Status](https://david-dm.org/vodkabears/remodal/dev-status.svg)](https://david-dm.org/vodkabears/remodal#info=devDependencies)
Remodal
=======
Flat, responsive, lightweight, fast, easy customizable modal window plugin with declarative state notation and hash tracking.

#IMPORTANT!

**v0.4.0 has incompatible changes.**

## Notes
* All modern browsers are supported.
* Only webkit browsers have a blur effect in the default css theme. If you want a blur for other browsers, use this: https://github.com/Schepp/CSS-Filters-Polyfill, but it's not fast like a native css3 blur.
* IE8+. To enable IE8 styles add `lt-ie9` class to the `html` element, as modernizr does.
* Zepto support.

## Start

That's very simple to start using Remodal.

[Download it](https://github.com/VodkaBears/Remodal/releases/latest). You can use bower: `bower install remodal`.

Add this in the head section:
```html
<link rel="stylesheet" href="path/to/your/jquery.remodal.css">
```

Add this before the `</body>` or in the head:
```html
<script src="path/to/your/jquery.remodal.min.js"></script>
```

Define the background container for the modal(for effects like a blur). It can be any simple content wrapper:
```html
<div class="remodal-bg">
...Page content...
</div>
```

And now create the modal dialog:
```html
<div class="remodal" data-remodal-id="modal">
    <h1>Remodal</h1>
    <p>
      Flat, responsive, lightweight, fast, easy customizable modal window plugin
      with declarative state notation and hash tracking.
    </p>
    <br>
    <a class="remodal-cancel" href="#">Cancel</a>
    <a class="remodal-confirm" href="#">OK</a>
</div>
```

So, now you can call it with the hash:
```html
<a href="#modal">Call the modal with data-remodal-id="modal"</a>
```
Or:
```html
<a data-remodal-target="modal">Call the modal with data-remodal-id="modal"</a>
```

## Globals

```html
<script>
    window.remodalGlobals = {
        namespace: "modal",
        defaults: {
            hashTracking: false
        }
    };
</script>
<script src="js/jquery.remodal.js"></script>
```

#### namespace

Base HTML class for your modals. CSS theme will need to be updated to reflect this.

#### defaults

Extends default settings.

## Options

You can pass additional options by the `data-remodal-options` attribute.
```html
<div class="remodal" data-remodal-id="modal"
    data-remodal-options="hashTracking: false">
    <h1>Remodal</h1>
    <p>
      Flat, responsive, lightweight, fast, easy customizable modal window plugin
      with declarative state notation and hash tracking.
    </p>
    <br>
    <a class="remodal-cancel" href="#">Cancel</a>
    <a class="remodal-confirm" href="#">OK</a>
</div>
```

#### hashTracking
`Default: true`

To open the modal without the hash, use `data-remodal-target` attribute.
```html
<a data-remodal-target="modal" href="#modal">Call the modal with data-remodal-id="modal"</a>
```

#### closeOnConfirm
`Default: true`

If set to true, closes a modal window after clicking confirm button.

#### closeOnCancel
`Default: true`

If set to true, closes a modal window after clicking cancel button.

#### closeOnEscape
`Default: true`

If set to true, closes a modal window after pressing ESC button.

#### closeOnAnyClick
`Default: true`

If set to true, closes a modal window by clicking anywhere on the page.

## Events

```js
$(document).on('open', '.remodal', function () {
    console.log('open');
});

$(document).on('opened', '.remodal', function () {
    console.log('opened');
});

$(document).on('close', '.remodal', function (e) {
    console.log('close');

    // "confirmation", or "cancellation", or undefined
    console.log(e.reason);
});

$(document).on('closed', '.remodal', function (e) {
    console.log('closed');

    // "confirmation", or "cancellation", or undefined
    console.log(e.reason);
});

$(document).on('confirm', '.remodal', function () {
    console.log('confirm');
});

$(document).on('cancel', '.remodal', function () {
    console.log('cancel');
});
```

## Cool bro! But i don't like declarative style!

Ok, don't set the class attribute and write something like this:
```html
<script>
    var options = {...};
    $('[data-remodal-id=modal]').remodal(options).open();
</script>
```
Don't use `id` attribute, if you want to avoid the anchor jump.

## Methods

Get the instance of the modal and call a method:
```js
var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];

// open the modal
inst.open();

// close the modal
inst.close();
```

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
