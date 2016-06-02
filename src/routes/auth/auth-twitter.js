(function () {

    'use strict';

    var jwt = require('./auth-jwt'),
        Strategy = require('passport-twitter').Strategy,
        secret_tw = require('../../../secrets/twitter'),
        db_users = require('../../database/db-users'),
        env = require('../../../secrets/environment');

    // Main router where twitter authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server, passport) {

        passport.use(new Strategy({
            consumerKey: secret_tw.consumerKey,
            consumerSecret: secret_tw.consumerSecret,
            callbackURL: 'http://' + env.url + ':' + env.port  + '/api/auth/twitter/callback'
        },
            function (accessToken, refreshToken, profile, next) {
                var user = {
                    name: profile.username,
                    twitter_id: profile.id
                };
                db_users.select_tw(user.twitter_id)
                    .then(function (user) {
                        return next(null, user);
                    })
                    .catch(function (err) {
                        db_users.insert(user)
                            .then(function (user) {
                                return next(null, user);
                            })
                            .catch(function (error) {
                                return next(null, null);
                            });
                    });
            }));

        server.get('/api/auth/twitter',
            passport.authenticate('twitter'));

        server.get('/api/auth/twitter/callback',
            passport.authenticate('twitter', {
                failureRedirect: '/'
            }),
            function (req, res) {
                jwt.encode({
                    id: req.user._id
                })
                    .then(function (encoded) {
                        res.cookie('session', encoded, {
                            maxAge: 14 * 24 * 3600000,
                            httpOnly: true
                        });
                        res.redirect('http://' + env.url + '/lobby');
                    });
            });

    };

} ());
