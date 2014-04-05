Remodal
=======

Flat, responsive, lightweight, fast, easy customizable modal window plugin with declarative state notation and hash tracking.

Minified version size: ~4kb

## Notes
* All modern browsers are supported.
* Only webkit browsers has a blur effect in the default css theme. If you want a blur for another kind of browsers use: https://github.com/Schepp/CSS-Filters-Polyfill, but it's not fast like a native css3 blur.
* IE9+
* JS code works in IE8 too, but css styles on your own, i don't want to pollute it.
* Zepto support.

## Start

That's very simple too start using Remodal.

Add this in the head section:
```html
<link rel="stylesheet" href="path/to/your/jquery.remodal.css">
```

Add this before the `</body>`(or in the head):
```html
<script src="path/to/your/jquery.remodal.min.js"></script>
```

Define the background container for the modal(for effects like a blur). It could be any simple content wrapper:
```html
<div class="remodal-bg">
...All your content...
</div>
```

And now create a modal dialog:
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

So, now you can call it with a hash:
```html
<a href="#modal">Call the modal with data-remodal-id="modal"</a>
```

## Options

You can pass additional options by the data-remodal-options attribute. Data must be valid JSON.
```html
<div class="remodal" data-remodal-id="modal"
    data-remodal-options='{ "hashTracking": false }'>
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

To open a modal without a hash, use `data-remodal-target` attribute. 
```html
<a data-remodal-target="modal" href="#modal">Call the modal with data-remodal-id="modal"</a>
```

## Events

```js
$(document).on('open', '.remodal', function () {
    var modal = $(this);
});

$(document).on('opened', '.remodal', function () {
    var modal = $(this);
});

$(document).on('close', '.remodal', function () {
    var modal = $(this);
});

$(document).on('closed', '.remodal', function () {
    var modal = $(this);
});

$(document).on('confirm', '.remodal', function () {
    var modal = $(this);
});

$(document).on('cancel', '.remodal', function () {
    var modal = $(this);
});
```

## Cool bro! But i don't like declarative style!

Ok, don't set class attribute and write something like this:
```html
<script>
    var options = {...};
    $('[data-remodal-id=modal]').remodal(options).open();
</script>
```
Don't use `id` attribute, if you don't want browser scrolling to the anchor point.

## Methods

Get an instance of modal and call a method:
```js
var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];

// open a modal
inst.open();

// close a modal
inst.close();
```
