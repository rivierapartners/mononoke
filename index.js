var watch = require('watch');
var minimatch = require('minimatch');

var checkGlobs = function (callback, globs, filename) {

    if(typeof(callback) !== "function") {
        return;
    }

    console.log("In checkglobs!");
    console.log(callback);
    console.log(globs);
    console.log(filename);

    if (globs.length) {
        for(i in globs) {
            if(globs.hasOwnProperty(i)) {
                var currentGlob = globs[i];
                if(minimatch(filename, currentGlob)) {
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
    this.root = root; 
    if(typeof(globs) === "undefined") { console.log("undef!"); globs = [ ]; }

    this.created = function(callback) {
        _createdCallback = callback;
        return _self;
    }; 

    this.changed = function(callback) {
        _changedCallback = callback;
        return _self;
    }; 

    watch.createMonitor(this.root, function(monitor) {
        monitor.on("created", function (f, stat) {
            checkGlobs(_createdCallback, globs, f);
        })
        monitor.on("changed", function (f, curr, prev) {
            checkGlobs(_changedCallback, globs, f);
        })
    })

    return _self;
};


var TreeWatch = {
    "watch" : function(root) {
        return new _watcher(root);
    }
};

 module.exports = TreeWatch;
