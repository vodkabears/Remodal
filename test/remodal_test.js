(function ($, location, document) {
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

    var index1, index2, $inst1, $inst2,
        $document = $(document);

    QUnit.begin(function () {
        index1 = $("[data-remodal-id=modal]").data("remodal");
        index2 = $("[data-remodal-id=modal2]").data("remodal");
        $inst1 = $.remodal.lookup[index1];
        $inst2 = $.remodal.lookup[index2];
    });

    QUnit.test("Auto-initialization", function () {
        equal(index1, 0);
        equal(index2, 1);
        ok($inst1);
        ok($inst2);
    });

    QUnit.test("JS-initialization", function () {
        var $inst3 = $("[data-remodal-id=modal3]").remodal();
        equal($inst3.index, 2);
        ok($inst3);
    });

    QUnit.asyncTest("Hash tracking", function (assert) {
        $document.one("opened", "[data-remodal-id=modal]", function () {
            assert.ok(true, "the modal is opened");
            location.hash = "#";
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "the modal is closed");
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("Opening with the `data-remodal-target` directive", function (assert) {
        $document.one("opened", "[data-remodal-id=modal]", function () {
            assert.ok(true, "the modal is opened");
            location.hash = "#";
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "the modal is closed");
            QUnit.start();
        });

        $("[data-remodal-target=modal]").click();
    });

    QUnit.asyncTest("events", function (assert) {
        var $confirmButton = $inst1.confirm,
            $cancelButton = $inst1.cancel;

       $document.one("open", "[data-remodal-id=modal]", function () {
            assert.ok(true, "opening");
        });

        $document.one("opened", "[data-remodal-id=modal]", function () {
            assert.ok(true, "opened");
            $confirmButton.click();
        });

        $document.one("confirm", "[data-remodal-id=modal]", function () {
            assert.ok(true, "confirmed");
            $confirmButton.click();
        });

        $document.one("close", "[data-remodal-id=modal]", function () {
            assert.ok(true, "closing");
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "closed");
            $inst1.open();

            $document.one("opened", "[data-remodal-id=modal]", function () {
                $cancelButton.click();
            });
        });

        $document.one("cancel", "[data-remodal-id=modal]", function () {
            assert.ok(true, "canceled");

            $document.one("closed", "[data-remodal-id=modal]", function () {
                QUnit.start();
            });
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("Confirm button click", function (assert) {
        var $confirmButton = $inst1.confirm;

        $document.one("opened", "[data-remodal-id=modal]", function () {
            $confirmButton.click();
        });

        $document.one("confirm", "[data-remodal-id=modal]", function () {
            assert.ok(true, "confirm button works");
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("Cancel button click", function (assert) {
        var $cancelButton = $inst1.cancel;

        $document.one("opened", "[data-remodal-id=modal]", function () {
            $cancelButton.click();
        });

        $document.one("cancel", "[data-remodal-id=modal]", function () {
            assert.ok(true, "cancel button works");
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("Close button click", function (assert) {
        var $closeButton = $inst1.modalClose;

        $document.one("opened", "[data-remodal-id=modal]", function () {
            $closeButton.click();
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "Close button works");
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("Overlay click", function (assert) {
        var $overlay = $inst1.overlay;

        $document.one("opened", "[data-remodal-id=modal]", function () {
            $overlay.click();
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "overlay click works");
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.asyncTest("methods", function (assert) {
        $document.one("opened", "[data-remodal-id=modal]", function () {
            assert.ok(true, "opening");
            $inst1.close();
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(true, "closed");
            QUnit.start();
        });

        $inst1.open();
    });

    QUnit.test("animation timeout", function () {
        // check animation timeout
        equal(~~$inst1.td, 300);
    });

    QUnit.asyncTest("lock/unlock the scroll bar", function (assert) {
        $(document.body).css("height", "10000px");

        $document.one("opened", "[data-remodal-id=modal]", function () {
            assert.ok($("html, body").hasClass("remodal_lock"));
            assert.ok(parseInt($(document.body).css("padding-right")) > 0);
            $inst1.close();
        });

        $document.one("closed", "[data-remodal-id=modal]", function () {
            assert.ok(!$("html, body").hasClass("remodal_lock"));
            assert.ok(parseInt($(document.body).css("padding-right")) === 0);
            QUnit.start();
        });

        location.hash = "#modal";
    });

    QUnit.test("Options parsing", function () {
        propEqual($inst2.settings, {
            hashTracking: false,
            closeOnConfirm: false,
            closeOnCancel: false
        });
    });

    QUnit.asyncTest("Options", function (assert) {
        $inst2.open();
        assert.ok(!location.hash, "hashTracking is disabled");

        $document.one("confirm", "[data-remodal-id=modal2]", function () {
            setTimeout(function () {
                assert.ok($inst2.overlay.css("display") === "block");
            }, $inst2.td + 100);
        });

        $document.one("cancel", "[data-remodal-id=modal2]", function () {
            setTimeout(function () {
                assert.ok($inst2.overlay.css("display") === "block");
                QUnit.start();
            }, $inst2.td + 100);
        });

        $inst2.confirm.click();
        $inst2.cancel.click();
    });
}(jQuery, location, document));
