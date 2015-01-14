var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs.extra');

var init = function() {
    process.chdir("spec");
    rimraf.sync("run")
    fs.mkdirSync("run");
    process.chdir("run");
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

var createFile = function(maindir, filepath, content) {
    var dirname = path.dirname(filepath);
    var basename = path.basename(filepath);

    if(dirname !== ".") {
        process.chdir(maindir);
        fs.mkdirpSync(dirname);
    }
    process.chdir(dirname);
    fs.writeFileSync(basename, content);
}

var initTestDir = function(dir, dirconf) {
    fs.mkdirpSync(dir);
    process.chdir(dir);
    writeFiles(dirconf);
};

var inspecter = function(fullpath, done, f) {
    setTimeout(function() {
        f();
        done();
        return;
    }, 2000);
}

var wipe = function(project_root) {
    process.chdir(project_root);
    rimraf.sync("spec/run");
}


module.exports = {
    "init": init,
    "inspecter" : inspecter,
    "initTestDir" : initTestDir,
    "createFile" : createFile,
    "wipe" : wipe
};
