Remodal
=======

Flat, responsive, lightweight, fast, easy customizable modal window plugin with declarative state notation and hash tracking.

Minified version size: ~4kb

## Basic

That's very simple too start using Remodal.

Add this in the head section:
```html
    <link rel="stylesheet" href="path/to/your/jquery.remodal.css">
```

Add this before the `</body>`(or in the head):
```html
    <script src="path/to/your/jquery.remodal.min.js"></script>
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

