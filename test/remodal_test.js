!(function($, location, document) {
  /*
   ======== A Handy Little QUnit Reference ========
   http://api.qunitjs.com/

   Test methods:
   module(name, {[setup][ ,teardown]})
   test(name, callback)
   expect(numberOfAssertions)
   stop(increment)
   start(decrement)
   Test assertions:
   ok(value, [message])
   equal(actual, expected, [message])
   notEqual(actual, expected, [message])
   deepEqual(actual, expected, [message])
   notDeepEqual(actual, expected, [message])
   strictEqual(actual, expected, [message])
   notStrictEqual(actual, expected, [message])
   throws(block, [expected], [message])
   */

  var $document = $(document);
  var index1;
  var index2;
  var $inst1;
  var $inst2;

  QUnit.begin(function() {
    index1 = $('[data-remodal-id=modal]').data('remodal');
    index2 = $('[data-remodal-id=modal2]').data('remodal');
    $inst1 = $.remodal.lookup[index1];
    $inst2 = $.remodal.lookup[index2];
  });

  QUnit.test('Auto-initialization', function() {
    equal(index1, 0);
    equal(index2, 1);
    ok($inst1);
    ok($inst2);
  });

  QUnit.test('JS-initialization', function() {
    var $inst3 = $('[data-remodal-id=modal3]').remodal();

    ok($inst3);
    equal($inst3.index, 2);
  });

  QUnit.test('Re-initialization', function() {
    var $inst3 = $('[data-remodal-id=modal3]').remodal();

    ok($inst3);
    equal($inst3.index, 2);
  });

  QUnit.asyncTest('Hash tracking', function(assert) {
    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'the modal is opened');
      location.hash = '#';
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'the modal is closed');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Opening with the `data-remodal-target` directive', function(assert) {
    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'the modal is opened');
      location.hash = '#';
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'the modal is closed');
      QUnit.start();
    });

    $('[data-remodal-target=modal]').click();
  });

  QUnit.asyncTest('events', function(assert) {
    var $confirmButton = $inst1.$confirmButton;
    var $cancelButton = $inst1.$cancelButton;

    $document.one('open', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'opening');
    });

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'opened');
      $confirmButton.click();
    });

    $document.one('confirm', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'confirmed');
      $confirmButton.click();
    });

    $document.one('close', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'closing');
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'closed');
      $inst1.open();

      $document.one('opened', '[data-remodal-id=modal]', function() {
        $cancelButton.click();
      });
    });

    $document.one('cancel', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'canceled');

      $document.one('closed', '[data-remodal-id=modal]', function() {
        QUnit.start();
      });
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Confirm button click', function(assert) {
    var $confirmButton = $inst1.$confirmButton;

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $confirmButton.click();
    });

    $document.one('confirm', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'confirm button works');
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Cancel button click', function(assert) {
    var $cancelButton = $inst1.$cancelButton;

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $cancelButton.click();
    });

    $document.one('cancel', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'cancel button works');
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Close button click', function(assert) {
    var $closeButton = $inst1.$closeButton;

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $closeButton.click();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'Close button works');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Wrapper click', function(assert) {
    var $wrapper = $inst1.$wrapper;

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $wrapper.click();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'wrapper click works');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('methods', function(assert) {
    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'opening');
      $inst1.close();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'closed');
      QUnit.start();
    });

    $inst1.open();
  });

  QUnit.test('animation timeout', function() {

    // Check animation timeout
    equal(~~$inst1.td, 300);
  });

  QUnit.asyncTest('lock/unlock the scroll bar', function(assert) {
    $(document.body).css('height', '10000px');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok($('html, body').hasClass('remodal-is-locked'));
      assert.ok(parseInt($(document.body).css('padding-right')) > 0);
      $inst1.close();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(!$('html, body').hasClass('remodal-is-locked'));
      assert.ok(parseInt($(document.body).css('padding-right')) === 0);
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('do not lock/unlock the scroll bar twice', function(assert) {
    $('html').addClass('remodal-is-locked');
    $(document.body).css('height', '10000px').css('padding-right', '20px');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok($('html').hasClass('remodal-is-locked'));
      assert.ok(parseInt($(document.body).css('padding-right')) === 20);
      $inst1.close();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(!$('html').hasClass('remodal-is-locked'));
      assert.ok(parseInt($(document.body).css('padding-right')) < 20);
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.test('Options parsing', function() {
    propEqual($inst2.settings, {
      hashTracking: false,
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnEscape: true,
      closeOnAnyClick: true
    });
  });

  QUnit.asyncTest('Options', function(assert) {
    $inst2.open();
    assert.ok(!location.hash, 'hashTracking is disabled');

    $document.one('confirm', '[data-remodal-id=modal2]', function() {
      setTimeout(function() {
        assert.ok($inst2.$wrapper.css('display') === 'block');
      }, $inst2.td + 100);
    });

    $document.one('cancel', '[data-remodal-id=modal2]', function() {
      setTimeout(function() {
        assert.ok($inst2.$wrapper.css('display') === 'block');
        QUnit.start();
      }, $inst2.td + 100);
    });

    $inst2.$confirmButton.click();
    $inst2.$cancelButton.click();
  });
}(window.jQuery || window.Zepto, location, document));
