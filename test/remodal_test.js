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

  QUnit.test('Auto-initialization', function(assert) {
    var $elem1 = $('[data-remodal-id=modal]');
    var $elem2 = $('[data-remodal-id=modal2]');

    assert.equal($elem1.data('remodal'), 0, 'index is right');
    assert.equal($elem2.data('remodal'), 1, 'index is right');
    assert.ok($elem1.remodal(), 'instance exists');
    assert.ok($elem2.remodal(), 'instance exists');
  });

  QUnit.test('JS-initialization', function(assert) {
    var $elem = $('[data-remodal-id=modal3]');

    assert.ok($elem.remodal(), 'instance exists');
    assert.equal($elem.data('remodal'), 2, 'index is right');
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

  QUnit.asyncTest('`data-remodal-target` directive', function(assert) {
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

  QUnit.asyncTest('Events', function(assert) {
    var remodal = $('[data-remodal-id=modal]').remodal();
    var $confirmButton = $('[data-remodal-id=modal] [data-remodal-action=confirm]');
    var $cancelButton = $('[data-remodal-id=modal] [data-remodal-action=cancel]');

    $document.one('opening', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'opening');
    });

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'opened');
      $confirmButton.click();
    });

    $document.one('confirmation', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'confirmed');
    });

    $document.one('closing', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'closing');
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'closed');
      remodal.open();

      $document.one('opened', '[data-remodal-id=modal]', function() {
        $cancelButton.click();
      });
    });

    $document.one('cancellation', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'canceled');

      $document.one('closed', '[data-remodal-id=modal]', function() {
        QUnit.start();
      });
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Click on the confirmation button', function(assert) {
    var $confirmButton = $('[data-remodal-id=modal] [data-remodal-action=confirm]');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $confirmButton.click();
    });

    $document.one('confirmation', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'confirmation event is triggered');
    });

    $document.one('closing', '[data-remodal-id=modal]', function(e) {
      assert.equal(e.reason, 'confirmation', 'reason is right');
    });

    $document.one('closed', '[data-remodal-id=modal]', function(e) {
      assert.equal(e.reason, 'confirmation', 'reason is right');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Click on the cancel button', function(assert) {
    var $cancelButton = $('[data-remodal-id=modal] [data-remodal-action=cancel]');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $cancelButton.click();
    });

    $document.one('cancellation', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'cancellation event is triggered');
    });

    $document.one('closing', '[data-remodal-id=modal]', function(e) {
      assert.equal(e.reason, 'cancellation', 'reason is right');
    });

    $document.one('closed', '[data-remodal-id=modal]', function(e) {
      assert.equal(e.reason, 'cancellation', 'reason is right');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Click on the close button', function(assert) {
    var $closeButton = $('[data-remodal-id=modal] [data-remodal-action=close]');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $closeButton.click();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'close button works');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Click on the wrapper', function(assert) {
    var $wrapper = $('[data-remodal-id=modal]').parent();

    $document.one('opened', '[data-remodal-id=modal]', function() {
      $wrapper.click();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'wrapper click works');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Esc key up', function(assert) {
    $document.one('opened', '[data-remodal-id=modal]', function() {
      $document.trigger($.Event('keyup', { keyCode: 27 }));
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(true, 'Esc key works');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('#open, #close, #getState', function(assert) {
    var remodal = $('[data-remodal-id=modal]').remodal();

    $document.one('opening', '[data-remodal-id=modal]', function() {
      assert.equal(remodal.getState(), 'opening', 'state is "opening"');
    });

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.equal(remodal.getState(), 'opened', 'state is "opened"');
      remodal.close();
    });

    $document.one('closing', '[data-remodal-id=modal]', function() {
      assert.equal(remodal.getState(), 'closing', 'state is "closing"');
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.equal(remodal.getState(), 'closed', 'state is "closed"');
      QUnit.start();
    });

    remodal.open();
  });

  QUnit.asyncTest('Lock/unlock the scroll bar', function(assert) {
    var $html = $('html');
    var $body = $(document.body);
    var remodal = $('[data-remodal-id=modal]').remodal();

    $body.css('height', '10000px');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok($html.hasClass('remodal-is-locked'), 'page is locked');
      assert.ok(parseInt($body.css('padding-right')) >= 0, 'padding-right is added');
      remodal.close();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(!$html.hasClass('remodal-is-locked'), 'page isn\'t locked');
      assert.equal(parseInt($body.css('padding-right')), 0, 'padding-right equals 0');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.asyncTest('Do not lock/unlock the scroll bar twice', function(assert) {
    var $html = $('html');
    var $body = $(document.body);
    var remodal = $('[data-remodal-id=modal]').remodal();

    $html.addClass('remodal-is-locked');
    $body.css('height', '10000px').css('padding-right', '20px');

    $document.one('opened', '[data-remodal-id=modal]', function() {
      assert.ok($html.hasClass('remodal-is-locked'), 'page is locked');
      assert.equal(parseInt($body.css('padding-right')), 20, 'padding-right equals 20');
      remodal.close();
    });

    $document.one('closed', '[data-remodal-id=modal]', function() {
      assert.ok(!$html.hasClass('remodal-is-locked'), 'page isn\'t locked');
      assert.ok(parseInt($body.css('padding-right')) <= 20, 'padding-right is correct');
      QUnit.start();
    });

    location.hash = '#modal';
  });

  QUnit.test('Options parsing', function() {
    var remodal = $('[data-remodal-id=modal2]').remodal();

    propEqual(remodal.settings, {
      hashTracking: false,
      closeOnConfirm: false,
      closeOnCancel: false,
      closeOnEscape: true,
      closeOnAnyClick: true
    }, 'options are correctly parsed');
  });

  QUnit.asyncTest('Options', function(assert) {
    var $wrapper = $('[data-remodal-id=modal2]').parent();
    var remodal = $wrapper.children().remodal();

    remodal.open();
    assert.ok(!location.hash, 'hash tracking is disabled');

    $document.one('confirmation', '[data-remodal-id=modal2]', function() {
      setTimeout(function() {
        assert.equal($wrapper.css('display'), 'block', 'wrapper is visible');
      }, 50);
    });

    $document.one('cancellation', '[data-remodal-id=modal2]', function() {
      setTimeout(function() {
        assert.equal($wrapper.css('display'), 'block', 'wrapper is visible');
        QUnit.start();
      }, 50);
    });

    $wrapper.find('[data-remodal-action=confirm]').click();
    $wrapper.find('[data-remodal-action=cancel]').click();
  });

}(window.jQuery || window.Zepto, location, document));
