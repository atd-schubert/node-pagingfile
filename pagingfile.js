/*jslint node: true*/

'use strict';

var fs = require('fs');
var streamLib = require('stream-lib');
var temp = require('temp');

/**
 * @module pagingfile
 * @author Arne Schubert <atd.schubert@gmail.com>
 */

/**
 * A stream that reads from a temporay file
 * @constructor
 * @augments streamLib.Spawn
 */
var Pagingfile = function () {
    streamLib.Spawn.apply(this, arguments);
    this.on('finish', function () {
        this.cmd.kill();
    });
    this.on('end', function () {
        fs.unlink(this.path, function (err) {
            if (err) {
                return console.error('Error while deleting temporary file!', err);
            }
        });
    });
};

Pagingfile.prototype = {
    '__proto__': streamLib.Spawn.prototype,

    /**
     * Get the current path of the origin of this stream
     *
     * @param {Pagingfile~getPathCallback} cb
     * @param {string} [suffix] - Append an optional postfix on the temporary file name
     */
    getPath: function (cb, suffix) {
        if (this.path) {
            return cb(null, this.path);
        }
        this.path = temp.path({suffix: suffix});

        fs.writeFile(this.path, '', function () {
            this.spawn('tail', ['-f', this.path]);

            /**
             * @callback Pagingfile~getPathCallback
             * @param {null|Error} error - Error if there was one
             * @param {string} path - Path of the temporary file
             */
            return cb(null, this.path);
        }.bind(this));
    },

    path: null
};

module.exports = Pagingfile;
