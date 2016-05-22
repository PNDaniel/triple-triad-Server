(function () {

    'use strict';

    var passport = require('passport');

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

        // Require the routes related to facebook's authentication
        require('./auth-facebook')(server, passport);

        // Require the routes related to twitter's authentication
        require('./auth-twitter')(server);

        // Require the routes related to triple triad's authentication
        require('./auth-triple-triad')(server);

    };

} ());