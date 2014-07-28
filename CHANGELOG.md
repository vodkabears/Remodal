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
