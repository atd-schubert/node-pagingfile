# node-pagingfile
*Recycle a temporary file into a stream in node*

## How to install

Install with npm

```bash
npm install --save pagingfile
```

## How to use

The main idea behind this module is to serve a simple way to recycle data of processes with an output file back into the
stream flow.

With `.getPath(function(err, path){ ... })` you are able to get the path of the origin file for this stream.
Now you are able to use your output data directly as readable stream.

```js
var Pageingfile = require('pagingfile');

var paging

```
You are also able to "recycle" this data in stream, because this module misses every stream input from writable stream
excerpts the end event. This is why you are able to make constructions like this


```js
var functionThatOutputsToAFile;
var pagingfile = new Pagingfile();

pagingfile.on('data', function (chunk) {
    // Do something with this chunk...
});

pagingfile.getPath(function (err, path) {
    var 
    if (err) {
        return console.error('Not able to get a path...');
    }
    functionThatOutputsToAFile(path, function callback(err){
        if (err) {
            console.error('There was an error', err);
        }
        setTimeout(function () { // We must call this with a timeout because tail is
            pagingfile.end();    // slower then writing to file!
        }, 100);
    });
});

```

*This module is written with jsdoc. You can compile the docs with `jsdoc -d jsdoc pagefile.js README.md`. The compiled jsdoc is also included in the module
package on npm...*