(function () {

    'use strict';

    var jwt = require('jsonwebtoken'),
        Promise = require('bluebird'),
        env = require('../../../secrets/environment');

    // Function to encode an object to a string
    exports.encode = function (decoded) {
        return new Promise(function (resolve, reject) {
            var encoded = jwt.sign(decoded, env.token);
            resolve(encoded);
        });
    };

    // Function to decode an encoded string to an object (doesn't verify if the encoded string is valid)
    exports.decode = function (encoded) {
        return new Promise(function (resolve, reject) {
            var decoded = jwt.decode(encoded);
            resolve(decoded);
        });
    };

    // Function to verify if the encoded string is valid
    exports.verify = function (encoded) {
        return new Promise(function (resolve, reject) {
            jwt.verify(encoded, env.token, function (err, decoded) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    };

} ())