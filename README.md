gulp-tree-watch
===

gulp-tree-watch is a simple plugin for gulp that allows you to watch a directory recursively for any changes and assign a callback that
takes a single parameter, a filename, of any changed files in that directory.

** Usage **

`npm install gulp-tree-watch`

    var treewatch = require('gulp-tree-watch');

    gulp.task('minify', function() {
        treewatch(dir, function(file) {
            gulp.src(file)
                .pipe(...);
        });

    })
