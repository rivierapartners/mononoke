var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');

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


module.exports = {
    "init": init,
    "spyInspect": spyInspect
}
