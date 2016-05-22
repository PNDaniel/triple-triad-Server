(function () {

    'use strict';

    // Main router where all routes are called. This is done so the project code is cleaner and more maintainable.
    module.exports = function (server, http) {

        // Route to send random quote
        server.get('/api/status', function (req, res) {
            res.status(200).json({
                'ip': http.address().address,
                'port': http.address().port,
                'conn_db': false,
                'conn_fb': false,
                'conn_tw': false
            });
        });

        // Require the routes related to triple triad's authentication
        require('./auth/auth-router')(server);

    };

} ());