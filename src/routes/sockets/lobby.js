(function () {

    'use strict';

    var jwt = require('../auth/auth-jwt'),
        db_users = require('../../database/db-users'),
        db_games = require('../../database/db-games');

    // Main router for the lobby's socket connections.
    module.exports = function (io) {

        io.on('connection', function (socket) {

            var cookies = socket.handshake.headers.cookie.split('; '),
                session;

            for (var i = 0; i < cookies.length; i++) {
                if (cookies[i].indexOf('session') > -1) {
                    session = cookies[i].split('=')[1];
                }
            }

            jwt.verify(session)
                .then(function (user) {
                    socket.join(user.id);
                });

            socket.on('invite', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_users.select_id(user.id)
                            .then(function (user) {
                                io.to(req.id).emit('invite', {
                                    user: user
                                });
                            });
                    });
            });

            socket.on('accept', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_games.insert(user.id, req.id)
                            .then(function (game) {
                                // Notify game creator
                                io.to(game.creator).emit('game', {
                                    game: game
                                });
                                // Notify invited player
                                io.to(game.invited).emit('game', {
                                    game: game
                                });
                            });
                    });
            });

            socket.on('decline', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        // Notify game creator
                        io.to(user.id).emit('decline', {
                            user: req.id
                        });
                        // Notify invited player
                        io.to(req.id).emit('decline', {
                            user: user.id
                        });
                    });
            });

        });

    };

} ());