(function () {

    'use strict';

    var bcrypt = require('bcrypt-nodejs'),
        mongoose = require('mongoose'),
        Promise = require('bluebird'),
        secret_db = require('../../secrets/database'),
        uri = secret_db.host + ':' + secret_db.port,
        Schema = mongoose.Schema,
        UserSchema = new Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            password: {
                type: String
            },
            facebook_id: {
                type: Number
            },
            twitter_id: {
                type: Number
            }
        }, {
                collection: 'users'
            }),
        User = mongoose.model('User', UserSchema);

    // Connect to database
    exports.connect = function () {
        return new Promise(function (resolve, reject) {
            mongoose.connect(uri, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };

    // Insert any type of user
    exports.insert = function (user) {
        return new Promise(function (resolve, reject) {
            // Function to create a generic user. Works with all types of users (auth, facebook and twitter)
            function create(user) {
                User.create(user, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            };
            if (user.email && user.password) {
                bcrypt.hash(user.password, null, null, function (err, hash) {
                    // Overwriting password for the hashed password
                    user.password = hash;
                    // Create user with e-mail and password
                    create(user);
                });
            } else {
                // Create user with either Facebook ID or Twitter ID
                create(user);
            }
        });
    };

    function return_user(err, user, resolve, reject) {
        // If found an error in the query
        if (err) {
            reject(err);
        }
        // If found a user or user doesn't exist
        if (user) {
            delete user.password;
            resolve(user);
        } else {
            reject('No user found.');
        }
    };

    // Select a user by id
    exports.select_id = function (id) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                _id: id
            });
            query.findOne(function (err, user) {
                return_user(err, user, resolve, reject);
            });
        });
    };

    // Select a user by email
    exports.select_email = function (email) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                email: email
            });
            query.findOne(function (err, user) {
                return_user(err, user, resolve, reject);
            });
        });
    };

    // Select a user by name
    exports.select_name = function (name) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                name: name
            });
            query.findOne(function (err, user) {
                return_user(err, user, resolve, reject);
            });
        });
    };

    // Select a user by facebook id
    exports.select_fb = function (facebook_id) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                facebook_id: facebook_id
            });
            query.findOne(function (err, user) {
                return_user(err, user, resolve, reject);
            });
        });
    };

    // Select a user by twitter id
    exports.select_tw = function (twitter_id) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                twitter_id: twitter_id
            });
            query.findOne(function (err, user) {
                return_user(err, user, resolve, reject);
            });
        });
    };

} ());