(function () {

    'use strict';

    var bcrypt = require('bcrypt-nodejs'),
        mongoose = require('mongoose'),
        Promise = require('bluebird'),
        secret_db = require('../../secrets/database'),
        uri = secret_db.host + ':' + secret_db.port;

    // Connect to database
    exports.connect = function () {
        return new Promise(function (resolve, reject) {
            reject(uri);
        });
    };

} ());