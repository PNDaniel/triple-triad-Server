(function () {

    'use strict';

    var jwt = require('../auth/auth-jwt'),
        cards = require('../../database/cards'),
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

            socket.on('game', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_games.select_id(req.game)
                            .then(function (game) {
                                if (JSON.stringify(game.creator) === JSON.stringify(user.id) ||
                                    JSON.stringify(game.invited) === JSON.stringify(user.id)) {
                                    // Subscribe user to this game
                                    socket.join(game._id);
                                    // Send chat messages
                                    io.to(game._id).emit('chat', {
                                        game: game
                                    });
                                }
                                if (game.cards.creator.length === 0 || game.cards.invited.length === 0) {
                                    // Random cards 
                                    var random_cards = cards;
                                    random_cards.sort(function () {
                                        return 0.5 - Math.random()
                                    });
                                    db_games.update_cards(game._id, random_cards)
                                        .then(function (game) {
                                            console.log('Enviando jogo com cartas.');
                                            io.to(game._id).emit('game', {
                                                game: game
                                            });
                                        });
                                }
                            });
                    });
            });

            socket.on('msg', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        var chat = {
                            author: user.id,
                            msg: req.msg
                        };
                        db_games.update_chat(req.room, chat)
                            .then(function (game) {
                                io.to(game._id).emit('chat', {
                                    game: game
                                });
                            });
                    });
            });

            socket.on('status', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_users.update_status(user.id, req.status)
                            .then(function () {
                                db_users.select_status('online')
                                    .then(function (online_users) {
                                        db_users.select_status('ingame')
                                            .then(function (ingame_users) {
                                                io.emit('users', online_users.concat(ingame_users));
                                            });
                                    });
                                if (req.status !== 'ingame') {
                                    db_games.select_ongoing_with_user(user.id)
                                        .then(function (games) {
                                            for (var i = 0; i < games.length; i++) {
                                                io.to(games[i]._id).emit('disconnect', {
                                                    room: games[i]._id
                                                });
                                                db_games.remove(games[i]._id);
                                            }
                                        });
                                }
                            });
                    });
            });

            socket.on('disconnect', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_games.remove(req.room)
                            .then(function () {
                                io.to(req.room).emit('disconnect', {
                                    room: req.room
                                });

                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    });
            });

        });

    };

} ());