(function () {

    'use strict';

    var jwt = require('./auth-jwt'),
        string = require('../../utils/string'),
        db_users = require('../../database/db-users'),
        env = require('../../../secrets/environment');

    // Main router where triple-triad authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        // Route to register with e-mail & password
        server.post('/api/auth/register', function (req, res) {
            if (!string.isValidEmail(req.body.email)) {
                // Check if email is valid. 
                res.status(400).json({
                    message_class: 'error',
                    message: 'Email not valid.'
                });
            } else if (!string.isValidPassword(req.body.password)) {
                // Check if password is valid.
                res.status(400).json({
                    message_class: 'error',
                    message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number and be 8 characters long.'
                });
            } else {
                // In case every verification are valid
                db_users.select_email(req.body.email)
                    .then(function (user) {
                        db_users.update_pw(user._id, req.body.password)
                            .then(function () {
                                db_users.update_name(user.id, req.body.name)
                                    .then(function () {
                                        res.sendStatus(200);
                                    })
                                    .catch(function (err) {
                                        res.status(400).json(error);
                                    });
                            })
                            .catch(function (err) {
                                res.status(400).json(error);
                            });
                    })
                    .catch(function (error) {
                        db_users.insert(req.body)
                            .then(function (user) {
                                res.sendStatus(200);
                            })
                            .catch(function (error) {
                                res.status(400).json(error);
                            });
                    });
            }
        });

        server.post('/api/auth/login', function (req, res) {
            db_users.select_email_pw(req.body.email, req.body.password)
                .then(function (user) {
                    jwt.encode({
                        id: user._id
                    })
                        .then(function (encoded) {
                            res.cookie('session', encoded, {
                                maxAge: 14 * 24 * 3600000,
                                httpOnly: true
                            });
                            res.sendStatus(200);
                        });
                })
                .catch(function (err) {
                    res.status(400).json(err);
                });
        });

    };

} ());