(function () {

    'use strict';

    var passport = require('passport'),
        jwt = require('./auth-jwt'),
        db_users = require('../../database/db-users');

    // Main router where all authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // Initialize Passport and restore authentication state, if any, from the session.
        server.use(passport.initialize());
        server.use(passport.session());

        // TODO: Regex to any routes besides /api/status and /api/auth/* 
        server.use('/special', function (req, res, next) {
            jwt.verify(req.cookies.session)
                .then(function (user) {
                    db_users.select_id(user.id)
                        .then(function (user) {
                            next();
                        })
                        .catch(function (err) {
                            res.redirect('http://' + env.url + '/403');
                        });
                })
                .catch(function (err) {
                    res.redirect('http://' + env.url + '/403');
                });
        });

        // Require the routes related to facebook's authentication
        require('./auth-facebook')(server, passport);

        // Require the routes related to twitter's authentication
        require('./auth-twitter')(server, passport);

        // Require the routes related to triple triad's authentication
        require('./auth-triple-triad')(server);

        // Route to validate cookie
        server.get('/api/auth/validate', function (req, res) {
            jwt.verify(req.cookies.session)
                .then(function (user) {
                    db_users.select_id(user.id)
                        .then(function (user) {
                            res.sendStatus(200);
                        })
                        .catch(function (err) {
                            res.sendStatus(404);
                        });
                })
                .catch(function (err) {
                    res.sendStatus(403);
                });
        });

        // Route to logout a user
        server.post('/api/auth/logout', function (req, res) {
            res.cookie('session', null, {
                maxAge: 0,
                httpOnly: true
            });
            res.sendStatus(200);
        });

    };

} ());