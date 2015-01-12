var watch = require('watch');

/*

*/
var _watcher = function(root) {
    var _createdCallback = null;
    var _changedCallback = null;
    var _self = this;
    this.root = root; 

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
            if ( typeof(_createdCallback === "function") ) {
                _createdCallback(f);
            }
        })
        monitor.on("changed", function (f, curr, prev) {
            if ( typeof(this.changed === "function") ) {
                _changedCallback(f);
            }
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
