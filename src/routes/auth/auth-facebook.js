(function () {

    'use strict';

    var passport = require('passport'),
        Strategy = require('passport-facebook').Strategy,
        secret_fb = require('../../../secrets/facebook');

    // Main router where facebook authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        passport.use(new Strategy({
            clientID: secret_fb.clientID,
            clientSecret: secret_fb.clientSecret,
            callbackURL: 'http://localhost:8080/api/login/facebook/return',
            profileFields: ['name', 'emails']
        },
            function (accessToken, refreshToken, profile, cb) {
                // TODO: Connect to database
                //console.log(profile);
                return cb(null, profile);
            }));

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // Initialize Passport and restore authentication state, if any, from the session.
        server.use(passport.initialize());
        server.use(passport.session());

        server.get('/api/login/facebook',
            passport.authenticate('facebook'));

        // TODO: Redirects and set cookie
        server.get('/api/login/facebook/return',
            passport.authenticate('facebook', {
                failureRedirect: '/login'
            }),
            function (req, res) {
                //console.log(req.user._json.first_name + ' ' + req.user._json.last_name + ' ' + req.user._json.email);
                res.cookie('session', req.user._json.email, {
                    maxAge: 900000, httpOnly: true
                });
                res.redirect('http://localhost/lobby');
            });

    };

} ());