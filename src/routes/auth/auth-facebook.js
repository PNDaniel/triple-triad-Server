(function () {

    'use strict';

    var Strategy = require('passport-facebook').Strategy,
        secret_fb = require('../../../secrets/facebook'),
        db_users = require('../../database/db-users'),
        env = require('../../../secrets/environment');

    // Main router where facebook authentication routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server, passport) {

        passport.use(new Strategy({
            clientID: secret_fb.clientID,
            clientSecret: secret_fb.clientSecret,
            callbackURL: 'http://' + env.url + '/api/auth/facebook/callback',
            profileFields: ['name', 'emails']
        },
            function (accessToken, refreshToken, profile, next) {
                db_users.select_fb(profile._json.id)
                    .then(function (user) {
                        return next(null, user);
                    })
                    .catch(function (err) {
                        var user = {
                            email: profile._json.email,
                            name: profile._json.first_name + ' ' + profile._json.last_name,
                            facebook_id: profile._json.id
                        };
                        db_users.insert(user)
                            .then(function (user) {
                                return next(null, user);
                            })
                            .catch(function (error) {
                                return next(null, null);
                            });
                    });
            }));

        server.get('/api/auth/facebook',
            passport.authenticate('facebook', {
                session: false,
                scope: ['email']
            }));

        server.get('/api/auth/facebook/callback',
            passport.authenticate('facebook', {
                failureRedirect: '/'
            }),
            function (req, res) {
                // TODO: Encrypt _id & calculate cookie life time
                res.cookie('session', req.user._id, {
                    maxAge: 14 * 24 * 3600000,
                    httpOnly: true
                });
                res.redirect('http://' + env.url + '/lobby');
            });

    };

} ());