(function () {

    'use strict';

    var Promise = require('bluebird'),
        db_users = require('../../database/db-users');

    // Auth middleware where triple-triad authentication routes are verified. This is done so the project code is cleaner and more maintainable.
    module.exports = function (id) {
        return new Promise(function (resolve, reject) {
            db_users.select_id(id)
                .then(function (user) {
                    resolve(user);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    };

} ());