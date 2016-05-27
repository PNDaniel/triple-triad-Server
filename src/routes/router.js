(function () {

    'use strict';

    // Main router where all routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server, http) {

        var io = require('socket.io')(http);

        // Require the routes related to triple triad's authentication
        require('./auth/auth-router')(server);

        // Require the routes related to users
        require('./user')(server);

        // Require the routes related to users
        require('./game')(server);

        // Require the socket router
        require('./sockets/socket-router')(io);

        // Route to send random quote
        server.get('/api/status', function (req, res) {
            res.status(200).json({
                'ip': http.address().address,
                'port': http.address().port,
                'db': server.get('db')
            });
        });

    };

} ());