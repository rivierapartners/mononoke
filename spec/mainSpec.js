var fs = require('fs.extra'); // Does this actually work?
var sinon = require('sinon');
require('jasmine-sinon') // Add matchers for sinon.js
var path = require('path');
var mononoke = require('../index.js');
var utils = require('./utils.js');

var STYLESHEETS_DIR = "MononokeTesting/assets/vendor/sample/stylesheets";
var RESET_TIME = 1000;
var WATCH_TIME = 3500;
var PROJECT_ROOT = process.cwd(); // If this is using `jasmine` or `npm test`
var TEST_ROOT = null;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;

var dirconf = {
    'README.md' : 'blah',
    'yo.txt' : 'textfile1',
    'yoyoyo.txt' : 'textfile2',
    'hello.scss' : 'SCSS',
    'theme.scss' : 'yo',
    'basic-theme.css' : 'yo',
    'almost-done.html' : 'sdfsdf'
};


beforeAll(function() {
    // Need to set the testing root correctly.
    utils.init();
    TEST_ROOT = process.cwd();
    process.chdir(PROJECT_ROOT);
});

describe("mononoke filetree watching", function() {
    var cwd = null;

    beforeEach(function(done) {
        cwd = process.cwd();
        setTimeout(function() {
            utils.init();
            utils.initTestDir(STYLESHEETS_DIR, dirconf );
            done();
        }, RESET_TIME)
    });

    afterEach(function() {
        utils.wipe(PROJECT_ROOT);
    });

    describe("observing files in root with no globs", function() {
        var spy = null;
        beforeEach(function() {
            spy = sinon.spy();
        });
        it("should recognize created files", function(done) {
            mononoke.watch(cwd)
                .created(spy);

            setTimeout(function() {
                var filepath = "whywy.txt";
                var fullpath = path.join(TEST_ROOT, STYLESHEETS_DIR,filepath);
                utils.createFile(cwd, filepath, "blah");
                utils.inspecter(fullpath, done, function() {
                   expect(spy).toHaveBeenCalledOnce();
                   expect(spy).toHaveBeenCalledWith(fullpath);
                });
            }, WATCH_TIME);
        });
    });

    describe("Top level files with several filters", function() {
        var createdSpy = null;
        var changedSpy = null;

        beforeEach(function() {
            createdSpy = sinon.spy();
            changedSpy = sinon.spy();
        });

        it("should dispath the correct callback to the glob-matched file", function(done) {
            mononoke.watch(cwd, ['*.scss', '*.html'])
                .created(createdSpy)
                .changed(changedSpy)

            // Add files
            setTimeout(function() {
                // NOTE: Creating and appending to the file right after is 
                // pointless, since the watch scanner will only register
                // the new file.
                utils.createFile(cwd, "main_page.html", "o");
                utils.createFile(cwd, "other_page.html", "o");
                utils.createFile(cwd, "vendor_style.scss", "o");

                utils.createFile(cwd, "unneeded.css", "o");
                utils.createFile(cwd, "unneeded.htm", "o");
                utils.createFile(cwd, "unneeded.txt", "o");
                
                utils.appendFile(cwd, "unneeded.htm", "lolololol ol");
                utils.appendFile(cwd, "almost-done.html", "dfsdfdsf");
                utils.appendFile(cwd, "hello.scss", "additional");

                utils.inspecter(cwd, done, function() {
                    expect(createdSpy).toHaveBeenCalledThrice();
                    expect(createdSpy).toHaveBeenCalledWith(path.join(TEST_ROOT, STYLESHEETS_DIR, "main_page.html"));
                    expect(createdSpy).toHaveBeenCalledWith(path.join(TEST_ROOT, STYLESHEETS_DIR, "other_page.html"));
                    expect(createdSpy).toHaveBeenCalledWith(path.join(TEST_ROOT, STYLESHEETS_DIR, "vendor_style.scss"));

                    expect(changedSpy).toHaveBeenCalledTwice();
                    expect(changedSpy).toHaveBeenCalledWith(path.join(TEST_ROOT, STYLESHEETS_DIR, "almost-done.html"));
                    expect(changedSpy).toHaveBeenCalledWith(path.join(TEST_ROOT, STYLESHEETS_DIR, "hello.scss"));
                });
            }, WATCH_TIME);
        });
    })
});



