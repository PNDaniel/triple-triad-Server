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
                unique: true
            },
            name: {
                type: String,
                unique: true,
                required: true
            },
            password: {
                type: String
            },
            status: {
                type: String,
                default: 'offline'
            },
            facebook_id: {
                type: Number
            },
            twitter_id: {
                type: Number
            },
            games_won: {
                type: Number,
                default: 0
            }
        }, {
                collection: 'users'
            }),
        User = mongoose.model('User', UserSchema);

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

    // Select a user by id
    exports.select_id = function (id) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                _id: id
            });
            query.findOne(function (err, user) {
                // If found a user or user doesn't exist
                if (user) {
                    user.password = undefined;
                    resolve(user);
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
                // If found an error in the query
                if (err) {
                    reject(err);
                }
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
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (user) {
                    user.password = undefined;
                    resolve(user);
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
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
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (user) {
                    user.password = undefined;
                    resolve(user);
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
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
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (user) {
                    user.password = undefined;
                    resolve(user);
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
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
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (user) {
                    user.password = undefined;
                    resolve(user);
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
            });
        });
    };

    // Update name
    exports.update_name = function (id, name) {
        return new Promise(function (resolve, reject) {
            User.update({
                _id: id
            }, {
                    name: name
                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    };

    // Add a password to a account created with a social network
    exports.update_pw = function (id, password) {
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, null, null, function (err, hash) {
                User.update({
                    _id: id
                }, {
                        password: hash
                    }, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            });
        });
    };

    // Add a password to a account created with a social network
    exports.update_fb = function (id, facebook_id) {
        return new Promise(function (resolve, reject) {
            User.update({
                _id: id
            }, {
                    facebook_id: facebook_id
                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    };

    // Verifies e-mail and password for a user
    exports.select_email_pw = function (email, password) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                email: email
            });
            query.findOne(function (err, user) {
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (user) {
                    bcrypt.compare(password, user.password, function (err, res) {
                        if (res === true) {
                            user.password = undefined;
                            resolve(user);
                        } else {
                            reject('Wrong password.');
                        }
                    });
                } else {
                    reject({
                        error: 'No user found.'
                    });
                }
            });
        });
    };

    exports.update_status = function (id, status) {
        return new Promise(function (resolve, reject) {
            User.update({
                _id: id
            }, {
                    status: status
                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    };

    exports.select_status = function (status) {
        return new Promise(function (resolve, reject) {
            var query = User.where({
                status: status
            });
            query.find(function (err, users) {
                // If found an error in the query
                if (err) {
                    reject(err);
                }
                // If found a user or user doesn't exist
                if (users) {
                    for (var i = 0; i < users.length; i++) {
                        users[i].password = undefined;
                    }
                    resolve(users);
                } else {
                    reject({
                        error: 'No users found.'
                    });
                }
            });
        });
    };

    exports.update_wins = function (id, wins) {
        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(id, {
                "games_won": wins
            },
                {
                    safe: true,
                    upsert: true,
                    new: true
                }, function (err, user) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
        });
    };

    exports.select_all = function () {
        return new Promise(function (resolve, reject) {
            var query = User.where({});
            query.find(function (err, users) {
                // If found a user or user doesn't exist
                if (users) {
                    for (var i = 0; i < users.length; i++) {
                        users[i].password = undefined;
                    }
                    resolve(users);
                } else {
                    reject({
                        error: 'No users found.'
                    });
                }
                // If found an error in the query
                if (err) {
                    reject(err);
                }
            });
        });
    };

} ());