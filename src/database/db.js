(function () {

    'use strict';

    var mongoose = require('mongoose'),
        secret_db = require('../../secrets/database'),
        uri = secret_db.host + ':' + secret_db.port;

    // Connect to database
    exports.connect = function () {
        return new Promise(function (resolve, reject) {
            mongoose.connect(uri, function (error) {
                if (error) {
                    reject(error);
                } else {
                    // To create Users Schema in MongoDB
                    require('./db-users');
                    // To create Games Schema in MongoDB
                    require('./db-games');
                    resolve(uri);
                }
            });
        });
    };

} ());