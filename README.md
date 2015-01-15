mononoke
===

mononoke is a simple library that can be used with tools such as gulp that allows you to watch a directory recursively for any changes.
You assign a callback which takes a filename as a single parameter, which is applied to all the changed files.
You can also specify globbing patterns within each tree, to ensure only the selected files are returned.


**Usage**


For simple file watching to monitor all files in a directory:
    `npm install mononoke`

    var mononoke = require('mononoke');

    gulp.task('minify', function() {
        mononoke.watch(dir)
          .created(function(f) {
            gulp.src(f)
              .pipe()
            })
          .modified(function(f) {
            gulp.src(f)
              .pipe()
            })

    })

With globbing.

    mononoke.watch(dir, ['*.css', '*.scss' ])
      .modified(function(f) {
        minify(f);
      }
