/*jslint node: true*/
/*globals describe, it*/

'use strict';

var streamLib = require('stream-lib');
var fs = require('fs');
var Pagingfile = require('../');

describe('pagingfile', function () {
    it('should stream random data', function (done) {
        var randomStream = new streamLib.Random.Alphanumeric(),
            writeStream, // with fs.createWriteStream
            pagingfile = new Pagingfile(),
            dataPagingfile = '',
            dataRandom = '';

        randomStream.countdown = 99999;
        pagingfile.on('data', function (chunk) {
            dataPagingfile += chunk.toString();
        });
        pagingfile.on('end', function () {
            if (dataPagingfile === dataRandom) {
                return done();
            }
            return done(new Error('Wrong content'));
        });

        pagingfile.getPath(function (err, path) {
            if (err) {
                return done(err);
            }
            writeStream = fs.createWriteStream(path);

            writeStream.on('error', function (err) {
                return done(err);
            });

            randomStream.on('data', function (chunk) {
                dataRandom += chunk.toString();
            });

            writeStream.on('finish', function () {
                setTimeout(function () {
                    pagingfile.end();
                }, 200); // You have to set a threshold. writeStream is faster then tail!!!
            });

            randomStream
                .pipe(writeStream);
        });
    });
    it('should stream random data with big amount', function (done) {
        var randomStream = new streamLib.Random.Alphanumeric(),
            writeStream, // with fs.createWriteStream
            pagingfile = new Pagingfile(),
            dataPagingfile = '',
            dataRandom = '';

        this.timeout(10000);
        randomStream.countdown = 99999 * 100;
        pagingfile.on('data', function (chunk) {
            dataPagingfile += chunk.toString();
        });
        pagingfile.on('end', function () {
            if (dataPagingfile === dataRandom) {
                return done();
            }
            return done(new Error('Wrong content'));
        });

        pagingfile.getPath(function (err, path) {
            if (err) {
                return done(err);
            }
            writeStream = fs.createWriteStream(path);

            writeStream.on('error', function (err) {
                return done(err);
            });

            randomStream.on('data', function (chunk) {
                dataRandom += chunk.toString();
            });

            writeStream.on('finish', function () {
                setTimeout(function () {
                    pagingfile.end();
                }, 300); // You have to set a threshold. writeStream is faster then tail!!!
            });

            randomStream
                .pipe(writeStream);
        });
    });

    it('should remove temporary pagingfile on file system', function (done) {
        var pagingfile = new Pagingfile(),
            path;

        pagingfile.getPath(function (err, p) {
            if (err) {
                return done(err);
            }
            path = p;
            pagingfile.end();

        });

        pagingfile.on('end', function () {
            fs.exists(path, function (exists) {
                if (!exists) {
                    return done();
                }
                return done(new Error('File was not deleted'));
            });
        });
        pagingfile.on('data', function () {
            // pumping data
        });
    });
});
