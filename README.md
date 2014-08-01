![Travis](https://travis-ci.org/VodkaBears/Remodal.svg?branch=master)
Remodal
=======
Flat, responsive, lightweight, fast, easy customizable modal window plugin with declarative state notation and hash tracking.

Minified version size: ~4kb

#IMPORTANT!
If your page body requires `height: 100%`, your page will scroll to the top([#20](https://github.com/VodkaBears/Remodal/issues/20), [#21](https://github.com/VodkaBears/Remodal/issues/21)), because remodal sets `overflow: hidden` to the html and body when opening to hide a scrollbar. There is no problem if your content doesn't overflow your full height body container, otherwise you should do something of this:
* Try to set `min-height: 100%` instead of `height: 100%`. If it doesn't help, read next.
* Set `html, body { overflow: auto !important; margin: 0; }`. Your page won't be locked and will be scrollable always.

## Notes
* All modern browsers are supported.
* Only webkit browsers has a blur effect in the default css theme. If you want a blur for another kind of browsers use: https://github.com/Schepp/CSS-Filters-Polyfill, but it's not fast like a native css3 blur.
* IE9+
* JS code works in IE8 too, but css styles on your own, i don't want to pollute it.
* Zepto support.

## Start

That's very simple too start using Remodal.

[Download it](https://github.com/VodkaBears/Remodal/archive/master.zip). You can use bower: `bower install remodal`

Add this in the head section:
```html
<link rel="stylesheet" href="path/to/your/jquery.remodal.css">
```

Add this before the `</body>` or in the head:
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
Or:
```html
<a data-remodal-target="modal">Call the modal with data-remodal-id="modal"</a>
```


## Options

You can pass additional options by the data-remodal-options attribute.
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

To open a modal without a hash, use `data-remodal-target` attribute. 
```html
<a data-remodal-target="modal" href="#modal">Call the modal with data-remodal-id="modal"</a>
```

#### closeOnConfirm
`Default: true`

If set to true, closes a modal window after clicking confirm button.

#### closeOnCancel
`Default: true`

If set to true, closes a modal window after clicking cancel button.


## Events

```js
$(document).on('open', '.remodal', function () {
    console.log('open');
});

$(document).on('opened', '.remodal', function () {
    console.log('opened');
});

$(document).on('close', '.remodal', function () {
    console.log('close');
});

$(document).on('closed', '.remodal', function () {
    console.log('closed');
});

$(document).on('confirm', '.remodal', function () {
    console.log('confirm');
});

$(document).on('cancel', '.remodal', function () {
    console.log('cancel');
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
