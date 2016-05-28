(function () {

    'use strict';

    var bcrypt = require('bcrypt-nodejs'),
        mongoose = require('mongoose'),
        Promise = require('bluebird'),
        secret_db = require('../../secrets/database'),
        uri = secret_db.host + ':' + secret_db.port,
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        GameSchema = new Schema({
            creator: {
                type: ObjectId,
                required: true
            },
            invited: {
                type: ObjectId,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            ongoing: {
                type: Boolean,
                required: true,
                default: true
            },
            chat: [
                {
                    author: {
                        type: ObjectId,
                        required: true
                    },
                    msg: {
                        type: String,
                        required: true
                    },
                    date: {
                        type: Date,
                        required: true
                    }
                }
            ]
        }, {
                collection: 'games'
            }),
        Game = mongoose.model('Game', GameSchema);

    // Insert a new game
    exports.insert = function (player_1, player_2) {
        return new Promise(function (resolve, reject) {
            var game = {
                creator: player_1,
                invited: player_2,
                date: new Date()
            };
            Game.create(game, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    exports.select_id = function (id) {
        return new Promise(function (resolve, reject) {
            var query = Game.where({
                _id: id
            });
            query.findOne(function (err, game) {
                // If found a user or user doesn't exist
                if (game) {
                    resolve(game);
                } else {
                    reject({
                        error: 'No game found.'
                    });
                }
                // If found an error in the query
                if (err) {
                    reject(err);
                }
            });
        });
    };

    exports.update_chat = function (id, chat) {
        return new Promise(function (resolve, reject) {
            Game.findByIdAndUpdate(id, {
                $push: {
                    "chat": {
                        author: chat.author,
                        msg: chat.msg,
                        date: new Date()
                    }
                }
            },
                {
                    safe: true,
                    upsert: true,
                    new: true
                }, function (err, game) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(game);
                    }
                });
        });
    };

    exports.remove = function (id) {
        return new Promise(function (resolve, reject) {
            Game.findByIdAndRemove(id, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    exports.select_ongoing_with_user = function (id) {
        return new Promise(function (resolve, reject) {
            var query = Game.where({
                ongoing: true,
                $or: [
                    { creator: id },
                    { invited: id }
                ]
            });
            query.find(function (err, games) {
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                if (games) {
                    resolve(games);
                }
            });
        });
    };

} ());