var fs = require('fs.extra'); // Does this actually work?
var sinon = require('sinon');
require('jasmine-sinon') // Add matchers for sinon.js
var path = require('path');
var rimraf = require('rimraf');
var mononoke = require('../index.js');

var STYLESHEETS_DIR = "MononokeTesting/assets/vendor/sample/stylesheets";
var PROJECT_ROOT = process.cwd(); // If this is using `jasmine` or `npm test`

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

var init = function() {
    process.chdir("spec");
    rimraf.sync("run")
    fs.mkdirSync("run");
    process.chdir("run");
    console.log("Currently in: " + process.cwd());
}

/*
 * Takes in an object with keys being filename strings and values
 * being some arbitrary string to representt a string file content.
 *
 */
var writeFiles = function(config) {
    for(filename in config) {
        if(config.hasOwnProperty(filename)){
            fs.writeFileSync(filename, config[filename]);
        }
    }
}

var createFile = function(filepath, content) {
    var dirname = path.dirname(filepath);
    var basename = path.basename(filepath);

    if(dirname !== ".") {
        process.chdir(STYLESHEETS_DIR);
        fs.mkdirpSync(dirname);
    }
    process.chdir(dirname);
    console.log(basename);
    console.log(content);
    fs.writeFileSync(basename, content);
}

var fsMakeStylesheets = function() {
    fs.mkdirpSync(STYLESHEETS_DIR);
    
    process.chdir(STYLESHEETS_DIR);
    dirconf = {
            'README.md' : 'blah',
            'yo.txt' : 'textfile1',
            'yoyoyo.txt' : 'textfile2',
            'hello.scss' : 'SCSS',
            'theme.scss' : 'yo',
            'basic-theme.css' : 'yo'
    };
    writeFiles(dirconf);
};

var spyInspect = function(done, spy, fullpath) {
    setTimeout(function() {
        console.log("Not running this...");
        expect(spy).toHaveBeenCalledOnce();
        console.log(spy.calledWith());
        expect(spy).toHaveBeenCalledWith(fullpath);
        done();
        return;
    }, 2000);
}

describe("Top levelfiles with no globbing", function() {
    beforeEach(function(done) {
        setTimeout(function() {

        init();
        fsMakeStylesheets();
        done();
        }, 2000)
    });

    afterEach(function() {
        process.chdir(PROJECT_ROOT);
        rimraf.sync("spec/run");
    });

    it("should recognize created files", function(done) {
        var spy = sinon.spy();
        var myspy = function(f) { console.log(f); }
        
        var cwd = process.cwd();
        mononoke.watch(cwd)
            .created(spy);

        var filepath = "whywy.txt";
        var fullpath = path.join(cwd,filepath);
        setTimeout(function() {
            createFile(filepath, "blah");
            spyInspect(done, spy, fullpath);
        }, 10000);

    });
});


