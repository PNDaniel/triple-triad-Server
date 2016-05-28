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
                expires: '24h'
            },
            chat: [
                {
                    author: {
                        type: ObjectId
                    },
                    msg: {
                        type: String
                    },
                    date: {
                        type: Date,
                        expires: '24h'
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

} ());