### 0.6.3
* Fix codestyle configs.

### 0.6.2
* Improved the codestyle.
* Used package.json instead of jquery.json.
* Updated dependencies.

### 0.6.1
* Fix '#on' event handlers.

### 0.6.0
* Added globals.
* Added the ability to change the namespace for CSS and events.
* Used '#on' instead of '#bind'.
* Fixed double locking/unlocking issue.
* Updated examples.
* Updated dependencies.
* Updated README.

### 0.5.0
* Fixed a scrolling to the top of a page.
* Added the 'reason' parameter to the close/closed events.
* Updated examples.
* Updated dependencies.

### 0.4.1
* Constructor always returns an instance(#61).

### 0.4.0
This version has incompatible changes!

* Changed CSS class names.
* Shared overlay.
* Changed visual styles.
* Improved IE8 styles.
* Updated dependencies.
* Fixes.

### 0.3.0
* Added font-size of inputs to prevent iOs zooming.
* Convert image for IE8 to base64.
* Fix tests.
* Fix scrollbar padding for Zepto.
* Code refactoring.
* Improved code linting.
* Cleaned up the repository.
* Updated dependencies.

### 0.2.1
* Moved @import to the top of the file. Meteor requires the @import to be at the top.
* Added some basic CSS support for IE8.
* Added CloseOnEscape and CloseOnAnyClick options.
* Updated README.md.
* Updated tests.

### 0.2.0
* Fix safari ghost padding bug(#26).
* Add parsing of non-json strings with options. Read docs.
* Fix jshint errors.
* Update examples.

### 0.1.7
* Catch syntax error if the hash is bad.
* Add 'closeOnConfirm', 'closeOnCancel' options.

### 0.1.6
* Fix #14, #11

### 0.1.5
* Support for trailing slashes in URL.
* Fix unnecessary body padding.

### 0.1.4
* Works in the old android, ios browsers and other.

### 0.1.3
* Fix page scrolling bug
* Refactor CSS

### 0.1.2
* Public collection of instances. Now you can get specific instance throw JS: `var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];`;
* Plugin constructor calling returns instance now. `var inst = $('[data-remodal-id=modal]').remodal()`.

### 0.1.1
* Zepto support!
* Blur is changed from 5px to 3px.
