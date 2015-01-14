var fs = require('fs.extra'); // Does this actually work?
var sinon = require('sinon');
require('jasmine-sinon') // Add matchers for sinon.js
var path = require('path');
var mononoke = require('../index.js');
var utils = require('./utils.js');

var STYLESHEETS_DIR = "MononokeTesting/assets/vendor/sample/stylesheets";
var PROJECT_ROOT = process.cwd(); // If this is using `jasmine` or `npm test`

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe("Top levelfiles with no globbing", function() {
    var spy = null;
    dirconf = {
            'README.md' : 'blah',
            'yo.txt' : 'textfile1',
            'yoyoyo.txt' : 'textfile2',
            'hello.scss' : 'SCSS',
            'theme.scss' : 'yo',
            'basic-theme.css' : 'yo'
    };

    beforeEach(function(done) {
        setTimeout(function() {
            utils.init();
            utils.initTestDir(STYLESHEETS_DIR, dirconf );
            spy = sinon.spy();
            done();
        }, 2000)
    });

    afterEach(function() {
        utils.wipe(PROJECT_ROOT);
    });

    it("should recognize created files", function(done) {
        var cwd = process.cwd();
        mononoke.watch(cwd)
            .created(spy);

        var filepath = "whywy.txt";
        var fullpath = path.join(cwd,filepath);
        setTimeout(function() {
            utils.createFile(STYLESHEETS_DIR, filepath, "blah");
            utils.spyInspect(done, spy, fullpath);
        }, 5000);

    });
});


