(function () {

    'use strict';

    // Main router where all routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server, http) {

        // Require the routes related to triple triad's authentication
        require('./auth/auth-router')(server);

        // Require the routes related to users
        require('./user')(server);

        // Route to send random quote
        server.get('/api/status', function (req, res) {
            res.status(200).json({
                'ip': http.address().address,
                'port': http.address().port,
                'db_users': server.get('db_users'),
                'db_games': server.get('db_games')
            });
        });

    };

} ());