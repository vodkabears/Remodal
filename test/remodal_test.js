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
      $document.trigger($.Event('keydown', { keyCode: 27 }));
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

  QUnit.test('#destroy', function(assert) {
    var remodal = $('<div data-remodal-id="modal4">')
      .appendTo($(document.body))
      .remodal();

    var instanceCount = $.grep($.remodal.lookup, function(instance) {
      return !!instance;
    }).length;

    assert.equal($('[data-remodal-id=modal4]').length, 1, 'modal exists');
    assert.equal(instanceCount, 4, 'count of instances is right');

    remodal.destroy();

    instanceCount = $.grep($.remodal.lookup, function(instance) {
      return !!instance;
    }).length;

    assert.equal($('[data-remodal-id=modal4]').length, 0, 'modal does not exist');
    assert.equal(instanceCount, 3, 'count of instances is right');
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
      assert.notOk($html.hasClass('remodal-is-locked'), 'page isn\'t locked');
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
      assert.notOk($html.hasClass('remodal-is-locked'), 'page isn\'t locked');
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
      closeOnEscape: false,
      closeOnOutsideClick: false,
      modifier: 'without-animation with-test-class'
    }, 'options are correctly parsed');
  });

  QUnit.test('"hashTracking" option', function(assert) {
    var $wrapper = $('[data-remodal-id=modal2]').parent();
    var remodal = $wrapper.children().remodal();

    remodal.open();
    assert.notOk(location.hash, 'hash tracking is disabled');
    remodal.close();
  });

  QUnit.asyncTest('"closeOnConfirm" option', function(assert) {
    var $wrapper = $('[data-remodal-id=modal2]').parent();
    var remodal = $wrapper.children().remodal();

    $document.one('opened', '[data-remodal-id=modal2]', function() {
      $wrapper.find('[data-remodal-action=confirm]').click();
    });

    $document.one('confirmation', '[data-remodal-id=modal2]', function() {
      assert.equal(remodal.getState(), 'opened', 'it is still opened');
      remodal.close();
    });

    $document.one('closed', '[data-remodal-id=modal2]', function() {
      QUnit.start();
    });

    remodal.open();
  });

  QUnit.asyncTest('"closeOnCancel" option', function(assert) {
    var $wrapper = $('[data-remodal-id=modal2]').parent();
    var remodal = $wrapper.children().remodal();

    $document.one('opened', '[data-remodal-id=modal2]', function() {
      $wrapper.find('[data-remodal-action=cancel]').click();
    });

    $document.one('cancellation', '[data-remodal-id=modal2]', function() {
      assert.equal(remodal.getState(), 'opened', 'it is still opened');
      remodal.close();
    });

    $document.one('closed', '[data-remodal-id=modal2]', function() {
      QUnit.start();
    });

    remodal.open();
  });

  QUnit.asyncTest('"closeOnEscape" option', function(assert) {
    var remodal = $('[data-remodal-id=modal2]').remodal();

    $document.one('opened', '[data-remodal-id=modal2]', function() {
      $document.trigger($.Event('keydown', { keyCode: 27 }));

      setTimeout(function() {
        assert.equal(remodal.getState(), 'opened', 'it is still opened');
        remodal.close();
      }, 50);
    });

    $document.one('closed', '[data-remodal-id=modal2]', function() {
      QUnit.start();
    });

    remodal.open();
  });

  QUnit.asyncTest('"closeOnOutsideClick" option', function(assert) {
    var $wrapper = $('[data-remodal-id=modal2]').parent();
    var remodal = $wrapper.children().remodal();

    $document.one('opened', '[data-remodal-id=modal2]', function() {
      $wrapper.click();

      setTimeout(function() {
        assert.equal(remodal.getState(), 'opened', 'it is still opened');
        remodal.close();
      }, 50);
    });

    $document.one('closed', '[data-remodal-id=modal2]', function() {
      QUnit.start();
    });

    remodal.open();
  });

  QUnit.asyncTest('"modifier" option', function(assert) {
    var $modal = $('[data-remodal-id=modal2]');
    var $overlay = $('.remodal-overlay');
    var $wrapper = $modal.parent();
    var $bg = $('.remodal-bg');
    var remodal = $modal.remodal();

    $document.one('opened', '[data-remodal-id=modal2]', function() {
      assert.ok($bg.hasClass('without-animation with-test-class'), 'bg has the modifier');
      assert.ok($overlay.hasClass('without-animation with-test-class'), 'overlay has the modifier');
      assert.ok($wrapper.hasClass('without-animation with-test-class'), 'wrapper has the modifier');
      assert.ok($modal.hasClass('without-animation with-test-class'), 'modal has the modifier');

      remodal.close();
    });

    $document.one('closed', '[data-remodal-id=modal2]', function() {
      assert.notOk($bg.hasClass('without-animation with-test-class'), 'bg hasn\'t the modifier');
      assert.notOk($overlay.hasClass('without-animation with-test-class'), 'overlay has\'t the modifier');
      assert.ok($wrapper.hasClass('without-animation with-test-class'), 'wrapper still has the modifier');
      assert.ok($modal.hasClass('without-animation with-test-class'), 'modal still has the modifier');

      QUnit.start();
    });

    remodal.open();
  });

}(window.jQuery || window.Zepto, location, document));
