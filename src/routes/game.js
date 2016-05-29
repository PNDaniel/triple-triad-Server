(function () {

    'use strict';

    var cards = require('../database/cards'),
        jwt = require('./auth/auth-jwt'),
        db_users = require('../database/db-users'),
        db_games = require('../database/db-games');

    // Main router where all game routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server) {

        // Route to get a user by ID
        server.get('/api/game/validate/:id', function (req, res) {
            jwt.verify(req.cookies.session)
                .then(function (user) {
                    db_users.select_id(user.id)
                        .then(function (user) {
                            db_games.select_id(req.params.id)
                                .then(function (game) {
                                    if (JSON.stringify(game.creator) === JSON.stringify(user._id) ||
                                        JSON.stringify(game.invited) === JSON.stringify(user._id)) {
                                        res.sendStatus(200);
                                    } else {
                                        res.sendStatus(403);
                                    }
                                })
                                .catch(function (err) {
                                    res.status(404).json(err);
                                });
                        })
                        .catch(function (err) {
                            res.status(404).json(err);
                        });
                })
                .catch(function (err) {
                    res.sendStatus(403);
                });
        });

        // Route to get all cards
        server.get('/api/game/cards', function (req, res) {
            res.status(200).json(cards);
        });

        // Route to get 5 random cards
        server.get('/api/game/cards/rnd', function (req, res) {
            var random_cards = cards;
            random_cards.sort(function () {
                return 0.5 - Math.random()
            });
            res.status(200).json(random_cards.slice(0, 5));
        });

        server.get('/api/games', function (req, res) {
            db_games.select_ongoing()
                .then(function (games) {
                    console.log(games);
                    res.status(200).json({
                        games: games.length
                    });
                })
                .catch(function (err) {
                    res.status(500).json(err);
                })
        });

    };

} ());