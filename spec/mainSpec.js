var rewire = require('rewire');
var sinon = require('sinon');
require('jasmine-sinon');
var watch = require('watch');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var mononoke = require('../index.js');
var assert = require('assert');

var FilenameEmitter = null;
var original = watch.createMonitor; // Original createMonitor function to actually process things correctly.

var mockWatch = {
    "createMonitor" : function(root, callback) {
        var spy = function(originalMonitor) {
            FilenameEmitter = originalMonitor; // Intercept the monitor to allow our own emits.
            callback(originalMonitor);
        };
        original(root, spy);
    },
    "unwatchTree" : watch.unwatchTree
}

beforeAll(function() {
    mononoke.setWatcher(mockWatch);
});

describe("maintest", function() {
    var createdSpy = null;
    var changedSpy = null;

    beforeEach(function() {
        createdSpy = sinon.spy();
        changedSpy = sinon.spy();
        console.log("Before each test.");
    });

    afterEach(function() {
        console.log("Finishing test");
        mockWatch.unwatchTree('./');
    });

    describe("basic", function() {
        beforeEach(function() {
            console.log("inner before test");
            mononoke.watch('./') 
                .created(createdSpy)
                .changed(changedSpy);
        });

        it("should work", function(done) {
            setTimeout(function() {
                console.log("FilenameEmitter is set...");
                FilenameEmitter.emit('created', 'file1.html');
                FilenameEmitter.emit('changed', 'file2.scss');
                FilenameEmitter.emit('created', 'file3.log');
                FilenameEmitter.emit('changed', 'file4.js');
                FilenameEmitter.emit('created', 'file5.js');

                expect(createdSpy).toHaveBeenCalledThrice();
                expect(changedSpy).toHaveBeenCalledTwice();
                done();
            }, 2000);
        });

    });

});
