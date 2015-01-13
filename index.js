var watch = require('watch');
var minimatch = require('minimatch');
var path = require('path');

var checkGlobs = function (callback, globs, filename) {
    var basename = path.basename(filename);

    if(typeof(callback) !== "function") {
        return;
    }

    if (globs.length) {
        for(i in globs) {
            if(globs.hasOwnProperty(i)) {
                var currentGlob = globs[i];
                // Minimatch should only look at the basename (filename without the path).
                if(minimatch(basename, currentGlob)) {
                    callback(filename);
                }
            }
        }
    }
    else {
        callback(filename);
    }
}

/*
 This is the constructor for a tree watcher that creates an EvenEmitter and
 watches a tree. This is accessed through TreeWatch.watch(root).
*/
var _watcher = function(root, globs) {
    var _createdCallback = null;
    var _changedCallback = null;
    var _self = this;

    this.created = function(callback) {
        _createdCallback = callback;
        return _self;
    }; 

    this.changed = function(callback) {
        _changedCallback = callback;
        return _self;
    }; 

    watch.createMonitor(root, function(monitor) {
        monitor.on("created", function (f, stat) {
            checkGlobs(_createdCallback, globs, f);
        })
        monitor.on("changed", function (f, curr, prev) {
            checkGlobs(_changedCallback, globs, f);
        })
    })

    return _self;
};


var mononoke = {
    "watch" : function(root, globs) {
        if(typeof(globs) === "undefined") { globs = [ ]; }
        return new _watcher(root, globs);
    }
};

 module.exports = mononoke;
