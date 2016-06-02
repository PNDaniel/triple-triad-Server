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
                                    db_games.update_random_cards(game._id, random_cards)
                                        .then(function (game) {
                                            console.log('Enviando jogo com cartas.');
                                            io.to(game._id).emit('game', {
                                                game: game
                                            });
                                        });
                                }
                            })
                            .catch(function (err) {
                                console.log(err);
                            })
                    });
            });

            function exists(obj, list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id === obj.id) {
                        return true;
                    }
                }
                return false;
            };

            socket.on('board', function (req) {
                var board = [];
                for (var i = 0; i < req.game.board.length; i++) {
                    if (req.game.board[i] !== null && req.game.board[i].id !== null) {
                        board[i] = {
                            id: req.game.board[i].id,
                            creator: req.game.board[i].creator || exists(req.game.board[i], req.game.cards.creator),
                            invited: req.game.board[i].invited || exists(req.game.board[i], req.game.cards.invited)
                        };
                    } else {
                        board[i] = {
                            id: undefined,
                            creator: undefined,
                            invited: undefined
                        };
                    }
                }

                db_games.select_id(req.game._id)
                    .then(function (game) {

                        /*
                            console.log('Old:');
                            console.log(game.board);
                            console.log('New:');
                            console.log(board);
                        */

                        // Descobrir carta nova
                        var i, j, newCard, newCardIndex;
                        for (i = 0; i < board.length; i++) {
                            for (j = 0; j < game.board.length; j++) {
                                if (board[i].id == game.board[j].id) {
                                    break;
                                }
                            }
                            if (j === game.board.length && board[i].id !== undefined) {
                                newCard = board[i];
                                newCardIndex = i;
                                break;
                            }
                        }

                        if (newCardIndex === 0) {
                            // direita
                            if (board[1] !== undefined && board[1].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 1.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[1].id].leftValue) {
                                    board[1].creator = newCard.creator;
                                    board[1].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 1.');
                                }
                            }
                            // baixo
                            if (board[3] !== undefined && board[3].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 3.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[3].id].topValue) {
                                    board[3].creator = newCard.creator;
                                    board[3].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 3.');
                                }
                            }
                        } else if (newCardIndex === 1) {
                            // direita
                            if (board[2] !== undefined && board[2].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 2.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[2].id].leftValue) {
                                    board[2].creator = newCard.creator;
                                    board[2].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 2.');
                                }
                            }
                            // baixo
                            if (board[4] !== undefined && board[4].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 4.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[4].id].topValue) {
                                    board[4].creator = newCard.creator;
                                    board[4].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 4.');
                                }
                            }
                            // esquerda
                            if (board[0] !== undefined && board[0].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 0.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[0].id].rightValue) {
                                    board[0].creator = newCard.creator;
                                    board[0].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 0.');
                                }
                            }
                        } else if (newCardIndex === 2) {
                            // baixo
                            if (board[5] !== undefined && board[5].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 5.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[5].id].topValue) {
                                    board[5].creator = newCard.creator;
                                    board[5].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 5.');
                                }
                            }
                            // esquerda
                            if (board[1] !== undefined && board[1].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 1.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[1].id].rightValue) {
                                    board[1].creator = newCard.creator;
                                    board[1].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 1.');
                                }
                            }
                        } else if (newCardIndex === 3) {
                            // cima
                            if (board[0] !== undefined && board[0].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 0.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[0].id].bottomValue) {
                                    board[0].creator = newCard.creator;
                                    board[0].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 0.');
                                }
                            }
                            // direita
                            if (board[4] !== undefined && board[4].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 4.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[4].id].leftValue) {
                                    board[4].creator = newCard.creator;
                                    board[4].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 4.');
                                }
                            }
                            // baixo
                            if (board[6] !== undefined && board[6].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 6.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[6].id].topValue) {
                                    board[6].creator = newCard.creator;
                                    board[6].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 6.');
                                }
                            }
                        } else if (newCardIndex === 4) {
                            // cima
                            if (board[1] !== undefined && board[1].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 1.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[1].id].bottomValue) {
                                    board[1].creator = newCard.creator;
                                    board[1].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 1.');
                                }
                            }
                            // direita
                            if (board[5] !== undefined && board[5].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 5.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[5].id].leftValue) {
                                    board[5].creator = newCard.creator;
                                    board[5].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 5.');
                                }
                            }
                            // baixo
                            if (board[7] !== undefined && board[7].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 7.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[7].id].topValue) {
                                    board[7].creator = newCard.creator;
                                    board[7].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 7.');
                                }
                            }
                            // esquerda
                            if (board[3] !== undefined && board[3].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 3.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[3].id].rightValue) {
                                    board[3].creator = newCard.creator;
                                    board[3].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 3.');
                                }
                            }
                        } else if (newCardIndex === 5) {
                            // cima
                            if (board[2] !== undefined && board[2].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 2.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[2].id].bottomValue) {
                                    board[2].creator = newCard.creator;
                                    board[2].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 2.');
                                }
                            }
                            // baixo
                            if (board[8] !== undefined && board[8].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 8.');
                                if (cards[board[newCardIndex].id].bottomValue > cards[board[8].id].topValue) {
                                    board[8].creator = newCard.creator;
                                    board[8].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 8.');
                                }
                            }
                            // esquerda
                            if (board[4] !== undefined && board[4].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 4.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[4].id].rightValue) {
                                    board[4].creator = newCard.creator;
                                    board[4].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 4.');
                                }
                            }
                        } else if (newCardIndex === 6) {
                            // cima
                            if (board[3] !== undefined && board[3].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 3.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[3].id].bottomValue) {
                                    board[3].creator = newCard.creator;
                                    board[3].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 3.');
                                }
                            }
                            // direita
                            if (board[7] !== undefined && board[7].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 7.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[7].id].leftValue) {
                                    board[7].creator = newCard.creator;
                                    board[7].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 7.');
                                }
                            }
                        } else if (newCardIndex === 7) {
                            // cima
                            if (board[4] !== undefined && board[4].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 4.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[4].id].bottomValue) {
                                    board[4].creator = newCard.creator;
                                    board[4].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 4.');
                                }
                            }
                            // direita
                            if (board[8] !== undefined && board[8].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 8.');
                                if (cards[board[newCardIndex].id].rightValue > cards[board[8].id].leftValue) {
                                    board[8].creator = newCard.creator;
                                    board[8].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 8.');
                                }
                            }
                            // esquerda
                            if (board[6] !== undefined && board[6].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 6.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[6].id].rightValue) {
                                    board[6].creator = newCard.creator;
                                    board[6].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 6.');
                                }
                            }
                        } else if (newCardIndex === 8) {
                            // cima
                            if (board[5] !== undefined && board[5].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 5.');
                                if (cards[board[newCardIndex].id].topValue > cards[board[5].id].bottomValue) {
                                    board[5].creator = newCard.creator;
                                    board[5].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 5.');
                                }
                            }
                            // esquerda
                            if (board[7] !== undefined && board[7].id !== undefined) {
                                console.log('Comparing ' + newCardIndex + ' with 7.');
                                if (cards[board[newCardIndex].id].leftValue > cards[board[7].id].rightValue) {
                                    board[7].creator = newCard.creator;
                                    board[7].invited = newCard.invited;
                                    console.log('Greater ' + newCardIndex + ' with 7.');
                                }
                            }
                        }

                        // Remove used cards from creator hand
                        for (var i = 0; i < req.game.cards.creator.length; i++) {
                            for (var j = 0; j < board.length; j++) {
                                if (req.game.cards.creator[i].id === board[j].id) {
                                    req.game.cards.creator.splice(i, 1);
                                    break;
                                }
                            }
                        }

                        // Remove used cards from invited hand
                        for (var i = 0; i < req.game.cards.invited.length; i++) {
                            for (var j = 0; j < board.length; j++) {
                                if (req.game.cards.invited[i].id === board[j].id) {
                                    req.game.cards.invited.splice(i, 1);
                                    break;
                                }
                            }
                        }

                        db_games.update_board(req.game._id, board)
                            .then(function (game) {
                                db_games.update_cards(game._id, req.game.cards.creator, req.game.cards.invited)
                                    .then(function (game) {
                                        // Verificar se o tabuleiro está cheio
                                        var sumCreator = 0, sumInvited = 0;
                                        for (var k = 0; k < game.board.length; k++) {
                                            if (game.board[k].creator) {
                                                sumCreator++;
                                            }
                                            if (game.board[k].invited) {
                                                sumInvited++;
                                            }
                                        }
                                        if ((sumCreator + sumInvited) === game.board.length) {
                                            db_games.select_id(game._id)
                                                .then(function (game) {
                                                    if (game.ongoing) {
                                                        console.log('END GAME ID: ' + game._id);
                                                        db_games.update_ongoing(game._id, false)
                                                            .then(function (game) {
                                                                // Ver quem tem mais cartas
                                                                if (sumCreator > sumInvited) {
                                                                    db_users.select_id(game.creator)
                                                                        .then(function (user) {
                                                                            console.log('User ' + user.name + ' now has won ' + (user.games_won + 1));
                                                                            db_users.update_wins(user._id, user.games_won + 1)
                                                                                .then(function (user) {
                                                                                    io.to(game._id).emit('endGame', {
                                                                                        winner: user
                                                                                    });
                                                                                });
                                                                        });
                                                                } else if (sumInvited > sumCreator) {
                                                                    db_users.select_id(game.invited)
                                                                        .then(function (user) {
                                                                            console.log('User ' + user.name + ' now has won ' + (user.games_won + 1));
                                                                            db_users.update_wins(user._id, user.games_won + 1)
                                                                                .then(function (user) {
                                                                                    io.to(game._id).emit('endGame', {
                                                                                        winner: user
                                                                                    });
                                                                                });
                                                                        });
                                                                }
                                                            });
                                                    }
                                                });
                                        } else {
                                            io.to(game._id).emit('game', {
                                                game: game
                                            });
                                        }
                                    });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });

                    });
            });

            socket.on('getGame', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        db_games.select_id(req.game)
                            .then(function (game) {
                                io.to(req.game).emit('game', {
                                    game: game
                                });
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