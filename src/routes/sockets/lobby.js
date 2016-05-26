(function () {

    'use strict';

    var jwt = require('../auth/auth-jwt'),
        db_users = require('../../database/db-users');

    // Main router for the lobby's socket connections.
    module.exports = function (io) {

        const room = 'lobby';

        io.on('connection', function (socket) {

            var cookies = socket.handshake.headers.cookie.split('; '),
                session;

            for (var i = 0; i < cookies.length; i++) {
                if (cookies[i].indexOf('session') > -1) {
                    session = cookies[i].split('=')[1];
                }
            }

            socket.on('status', function (req) {
                jwt.verify(session)
                    .then(function (user) {
                        socket.join(room);
                        db_users.update_status(user.id, req.status)
                            .then(function () {
                                db_users.select_status('online')
                                    .then(function (users) {
                                        io.sockets.in(room).emit('users', users);
                                    });
                            });
                    });
            });

        });

    };

} ());