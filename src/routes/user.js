(function () {

    'use strict';

    var jwt = require('./auth/auth-jwt'),
        db_users = require('../database/db-users');

    // Main router where all user routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        // Route to get the user itself
        server.get('/api/user', function (req, res) {
            jwt.verify(req.cookies.session)
                .then(function (user) {
                    db_users.select_id(user.id)
                        .then(function (user) {
                            res.status(200).json(user);
                        })
                        .catch(function (err) {
                            res.status(404).json(err);
                        });
                })
                .catch(function (err) {
                    res.sendStatus(403);
                });
        });

        // Route to get a user by ID
        server.get('/api/user/:id', function (req, res) {
            db_users.select_id(req.params.id)
                .then(function (user) {
                    res.status(200).json(user);
                })
                .catch(function (err) {
                    res.status(404).json(err);
                });
        });

    };

} ());