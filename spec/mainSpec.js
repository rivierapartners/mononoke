var sinon = require('sinon');
require('jasmine-sinon');
var path = require('path');
var mononoke = require('../index.js');
var watch = require('watch');

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
};

beforeAll(function() {
    mononoke.setWatcher(mockWatch);
});

describe("maintest", function() {
    var createdSpy = null;
    var changedSpy = null;

    beforeEach(function() {
        createdSpy = sinon.spy();
        changedSpy = sinon.spy();
    });

    afterEach(function() {
        mockWatch.unwatchTree('./');
    });

    describe("top level directory no globs", function() {
        beforeEach(function() {
            mononoke.watch('./') 
                .created(createdSpy)
                .changed(changedSpy);
        });

        it("should recognize both created and changed", function(done) {
            setTimeout(function() {
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

    
     describe("top level directory globs", function() {
        beforeEach(function() {
            mononoke.watch('./', ['*.scss', '*.js']) 
                .created(createdSpy)
                .changed(changedSpy);
        });

        it("should recognize both created and changed", function(done) {
            setTimeout(function() {
                FilenameEmitter.emit('created', 'file1.html');
                FilenameEmitter.emit('changed', 'file2.scss');
                FilenameEmitter.emit('created', 'file3.log');
                FilenameEmitter.emit('changed', 'file4.js');
                FilenameEmitter.emit('created', 'file5.js');

                expect(createdSpy).toHaveBeenCalledOnce();
                expect(changedSpy).toHaveBeenCalledTwice();
                done();
            }, 2000);
        });
    });

      describe("sub level directory globs", function() {
        beforeEach(function() {
            mononoke.watch('./', ['*.scss', '*.js']) 
                .created(createdSpy)
                .changed(changedSpy);
        });

        it("should recognize both created and changed", function(done) {
            setTimeout(function() {
                FilenameEmitter.emit('created', './inner/deep/file1.html');
                FilenameEmitter.emit('changed', './inner/file2.scss');
                FilenameEmitter.emit('created', 'file3.log');
                FilenameEmitter.emit('changed', './super/duper/very/deep/file4.js');
                FilenameEmitter.emit('created', 'file5.js');

                expect(createdSpy).toHaveBeenCalledOnce();
                expect(changedSpy).toHaveBeenCalledTwice();
                done();
            }, 2000);
        });
    });
});
